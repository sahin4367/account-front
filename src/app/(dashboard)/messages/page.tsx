'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../lib/api'

interface Message {
  id: number
  senderId: number
  text: string
  createdAt: string
}

interface Conversation {
  id: number
  participantUsername: string
  participantId: number
  lastMessage: string
  lastMessageAt: string
  unread: number
  listingTitle?: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'indi'
  if (m < 60) return `${m}d əvvəl`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}s əvvəl`
  return `${Math.floor(h / 24)}g əvvəl`
}

export default function MessagesPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const router = useRouter()
  const params = useSearchParams()

  const [convs, setConvs]               = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages]         = useState<Message[]>([])
  const [text, setText]                 = useState('')
  const [sending, setSending]           = useState(false)
  const [pageLoading, setPageLoading]   = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // ── Söhbətləri yüklə ──────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { router.push('/login'); return }

    const load = async () => {
      try {
        const res = await api.get('/messages')
        setConvs(res.data)
      } catch {
        setConvs([])
      } finally {
        setPageLoading(false)
      }
    }
    load()
  }, [isAuthenticated, authLoading, router])

  // ── URL-dən convId gələrsə həmin söhbəti aç ───────────────────
  useEffect(() => {
    const convId = params.get('convId')
    if (convId && convs.length > 0) {
      const found = convs.find(c => c.id === Number(convId))
      if (found) selectConv(found)
    }
  }, [params, convs])

  // ── Söhbət seç + mesajları yüklə ──────────────────────────────
  const selectConv = async (conv: Conversation) => {
    setSelectedConv(conv)
    setConvs(prev => prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c))
    try {
      const res = await api.get(`/messages/${conv.id}`)
      setMessages(res.data)
    } catch {
      setMessages([])
    }
  }

  // ── Mesaj göndər ───────────────────────────────────────────────
  const handleSend = async () => {
    if (!text.trim() || !selectedConv || sending) return
    setSending(true)

    const optimistic: Message = {
      id:        Date.now(),
      senderId:  user?.id ?? 0,
      text:      text.trim(),
      createdAt: new Date().toISOString(),
    }

    setMessages(prev => [...prev, optimistic])
    setConvs(prev => prev.map(c =>
      c.id === selectedConv.id
        ? { ...c, lastMessage: text.trim(), lastMessageAt: new Date().toISOString() }
        : c
    ))

    const sent = text.trim()
    setText('')

    try {
      await api.post(`/messages/${selectedConv.id}`, { text: sent })
    } catch {
      // optimistic update saxla
    } finally {
      setSending(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Auto scroll ────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text3)' }}>Yüklənir...</p>
      </div>
    )
  }

  const totalUnread = convs.reduce((sum, c) => sum + c.unread, 0)

  return (
    <main className="px-6 py-10">
      <div className="container mx-auto max-w-[960px]">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1
            className="font-display font-extrabold text-[28px] tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Mesajlar
          </h1>
          {totalUnread > 0 && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--yellow)', color: 'var(--black)' }}
            >
              {totalUnread}
            </span>
          )}
        </div>

        <div
          className="rounded-2xl overflow-hidden flex"
          style={{
            background: 'var(--black2)',
            border: '1px solid var(--border)',
            height: '600px',
          }}
        >

          {/* ── CONV LIST ── */}
          <div
            className="w-[280px] flex-shrink-0 flex flex-col overflow-y-auto"
            style={{ borderRight: '1px solid var(--border)' }}
          >
            {convs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <span className="text-[32px] mb-3">💬</span>
                <p className="text-[12px] text-center" style={{ color: 'var(--text3)' }}>
                  Hələ mesaj yoxdur
                </p>
              </div>
            ) : (
              convs.map(conv => {
                const isActive = selectedConv?.id === conv.id
                return (
                  <div
                    key={conv.id}
                    onClick={() => selectConv(conv)}
                    className="p-4 cursor-pointer transition-all"
                    style={{
                      background:   isActive ? 'var(--yellow-dim)' : 'transparent',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[13px] flex-shrink-0"
                        style={{
                          background: isActive ? 'var(--yellow)' : 'var(--black3)',
                          color:      isActive ? 'var(--black)' : 'var(--text2)',
                          border:     `1px solid ${isActive ? 'var(--yellow)' : 'var(--border)'}`,
                        }}
                      >
                        {conv.participantUsername.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p
                            className="font-bold text-[13px] truncate"
                            style={{ color: isActive ? 'var(--yellow)' : 'var(--text)' }}
                          >
                            {conv.participantUsername}
                          </p>
                          <span
                            className="text-[9px] flex-shrink-0 ml-1"
                            style={{ color: 'var(--text3)' }}
                          >
                            {conv.lastMessageAt ? timeAgo(conv.lastMessageAt) : ''}
                          </span>
                        </div>
                        {conv.listingTitle && (
                          <p
                            className="text-[9px] truncate"
                            style={{ color: 'var(--yellow)', opacity: .7 }}
                          >
                            {conv.listingTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pl-12">
                      <p className="text-[11px] truncate flex-1" style={{ color: 'var(--text3)' }}>
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span
                          className="ml-2 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--yellow)', color: 'var(--black)' }}
                        >
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* ── CHAT AREA ── */}
          {!selectedConv ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-[48px] mb-4">💬</span>
              <p
                className="font-display font-bold text-[15px] mb-1"
                style={{ color: 'var(--text)' }}
              >
                Söhbət seçin
              </p>
              <p className="text-[12px]" style={{ color: 'var(--text3)' }}>
                Sol tərəfdən söhbəti seçin
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-w-0">

              {/* Chat header */}
              <div
                className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[13px]"
                  style={{
                    background: 'var(--yellow-dim)',
                    color:      'var(--yellow)',
                    border:     '1px solid var(--yellow-border)',
                  }}
                >
                  {selectedConv.participantUsername.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[14px]" style={{ color: 'var(--text)' }}>
                    {selectedConv.participantUsername}
                  </p>
                  {selectedConv.listingTitle && (
                    <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                      {selectedConv.listingTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-[12px]" style={{ color: 'var(--text3)' }}>
                      Hələ mesaj yoxdur. İlk mesajı göndər!
                    </p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === user?.id
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className="max-w-[70%] px-4 py-2.5 text-[13px] leading-relaxed"
                          style={{
                            background:   isMe ? 'var(--yellow)' : 'var(--black3)',
                            color:        isMe ? 'var(--black)' : 'var(--text)',
                            borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          }}
                        >
                          {msg.text}
                          <p
                            className="text-[9px] mt-1 text-right"
                            style={{ color: isMe ? 'rgba(0,0,0,0.4)' : 'var(--text3)' }}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString('az-AZ', {
                              hour:   '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div
                className="p-4 flex items-end gap-3 flex-shrink-0"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Mesaj yaz... (Enter — göndər)"
                  rows={1}
                  className="flex-1 input resize-none py-2.5"
                  style={{ maxHeight: '120px', lineHeight: '1.5' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  className="btn-primary px-4 py-2.5 text-[13px] flex-shrink-0"
                  style={{ opacity: !text.trim() ? 0.4 : 1 }}
                >
                  {sending ? '...' : '↑'}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  )
}