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
  if (m < 60) return `${m}d evvel`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}s evvel`
  return `${Math.floor(h / 24)}g evvel`
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

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { router.push('/login'); return }
    const load = async () => {
      try {
        const res = await api.get('/messages')
        setConvs(res.data)
      } catch { setConvs([]) }
      finally { setPageLoading(false) }
    }
    load()
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const convId = params.get('convId')
    if (convId && convs.length > 0) {
      const found = convs.find(c => c.id === Number(convId))
      if (found) selectConv(found)
    }
  }, [params, convs])

  const selectConv = async (conv: Conversation) => {
    setSelectedConv(conv)
    setConvs(prev => prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c))
    try {
      const res = await api.get(`/messages/${conv.id}`)
      setMessages(res.data)
    } catch { setMessages([]) }
  }

  const handleSend = async () => {
    if (!text.trim() || !selectedConv || sending) return
    setSending(true)
    const optimistic: Message = { id: Date.now(), senderId: user?.id ?? 0, text: text.trim(), createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])
    setConvs(prev => prev.map(c => c.id === selectedConv.id ? { ...c, lastMessage: text.trim(), lastMessageAt: new Date().toISOString() } : c))
    const sent = text.trim()
    setText('')
    try { await api.post(`/messages/${selectedConv.id}`, { text: sent }) }
    catch {}
    finally { setSending(false) }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-slate-500 text-[13px]">Yuklenir...</p>
      </div>
    )
  }

  const totalUnread = convs.reduce((sum, c) => sum + c.unread, 0)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display font-black text-[32px] tracking-tight text-white leading-none">
            Mesajlar
          </h1>
          {totalUnread > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-yellow-500 text-black">
              {totalUnread}
            </span>
          )}
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden flex" style={{ height: 580 }}>

          {/* Conv list */}
          <div className="w-[260px] flex-shrink-0 flex flex-col overflow-y-auto border-r border-white/[0.06]">
            {convs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <span className="text-[32px] mb-3">💬</span>
                <p className="text-[12px] text-slate-500 text-center">Hele mesaj yoxdur</p>
              </div>
            ) : convs.map(conv => {
              const isActive = selectedConv?.id === conv.id
              return (
                <div
                  key={conv.id}
                  onClick={() => selectConv(conv)}
                  className="p-4 cursor-pointer transition-all border-b border-white/[0.05]"
                  style={{ background: isActive ? 'rgba(245,197,24,0.06)' : 'transparent' }}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[12px] flex-shrink-0"
                      style={{
                        background: isActive ? '#f5c518' : 'rgba(255,255,255,0.06)',
                        color:      isActive ? '#000' : '#94a3b8',
                      }}
                    >
                      {conv.participantUsername.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-[13px] truncate" style={{ color: isActive ? '#f5c518' : '#f1f5f9' }}>
                          {conv.participantUsername}
                        </p>
                        <span className="text-[9px] text-slate-600 flex-shrink-0 ml-1">
                          {conv.lastMessageAt ? timeAgo(conv.lastMessageAt) : ''}
                        </span>
                      </div>
                      {conv.listingTitle && (
                        <p className="text-[9px] truncate text-yellow-500/60">{conv.listingTitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-[42px]">
                    <p className="text-[11px] truncate flex-1 text-slate-500">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 text-[9px] font-bold w-4 h-4 rounded-full bg-yellow-500 text-black flex items-center justify-center flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Chat area */}
          {!selectedConv ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-[48px] mb-4">💬</span>
              <p className="font-display font-bold text-[15px] text-white mb-1">Sohbet secin</p>
              <p className="text-[12px] text-slate-500">Sol terefdeki sohbeti secin</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-w-0">

              {/* Chat header */}
              <div className="px-5 py-4 flex items-center gap-3 flex-shrink-0 border-b border-white/[0.06]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[12px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                  {selectedConv.participantUsername.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-white">{selectedConv.participantUsername}</p>
                  {selectedConv.listingTitle && (
                    <p className="text-[10px] text-slate-500">{selectedConv.listingTitle}</p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-[12px] text-slate-600">Hele mesaj yoxdur. Ilk mesaji gonder!</p>
                  </div>
                ) : messages.map(msg => {
                  const isMe = msg.senderId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="max-w-[70%] px-4 py-2.5 text-[13px] leading-relaxed"
                        style={{
                          background:   isMe ? '#f5c518' : 'rgba(255,255,255,0.06)',
                          color:        isMe ? '#000' : '#f1f5f9',
                          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        }}
                      >
                        {msg.text}
                        <p className="text-[9px] mt-1 text-right" style={{ color: isMe ? 'rgba(0,0,0,0.4)' : '#475569' }}>
                          {new Date(msg.createdAt).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 flex items-end gap-3 flex-shrink-0 border-t border-white/[0.06]">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Mesaj yaz... (Enter — gonder)"
                  rows={1}
                  className="flex-1 input resize-none py-2.5"
                  style={{ maxHeight: 120, lineHeight: 1.5 }}
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