'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../lib/api'

type Platform = 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'TELEGRAM' | 'FACEBOOK' | 'TWITTER'
type PriceType = 'fixed' | 'negotiable'

const PLATFORMS: { key: Platform; label: string; bg: string; accent: string }[] = [
  { key: 'INSTAGRAM', label: 'Instagram', bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', accent: '#fff'    },
  { key: 'TIKTOK',    label: 'TikTok',    bg: 'linear-gradient(135deg,#010101,#1a1a1a)',         accent: '#69c9d0' },
  { key: 'YOUTUBE',   label: 'YouTube',   bg: 'linear-gradient(135deg,#c00,#ff4e4e)',             accent: '#fff'    },
  { key: 'TELEGRAM',  label: 'Telegram',  bg: 'linear-gradient(135deg,#2ca5e0,#1a6fa8)',         accent: '#fff'    },
  { key: 'FACEBOOK',  label: 'Facebook',  bg: 'linear-gradient(135deg,#1877f2,#0d5bba)',         accent: '#fff'    },
  { key: 'TWITTER',   label: 'Twitter/X', bg: 'linear-gradient(135deg,#14171a,#1d9bf0)',         accent: '#1d9bf0' },
]

const NICHES = [
  'Musigi', 'Gozellik', 'Fitness', 'Texnologiya', 'Gaming',
  'Yemek', 'Seyahet', 'Biznes', 'Xeber', 'Kripto',
  'Lifestyle', 'Komedi', 'Tehsil', 'Diger',
]

const STEPS = ['Platform', 'Melumatlar', 'Qiymet', 'Tesdiq']

export default function SellPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)

  const [platform, setPlatform]                 = useState<Platform | ''>('')
  const [title, setTitle]                       = useState('')
  const [description, setDescription]           = useState('')
  const [followers, setFollowers]               = useState('')
  const [engagementRate, setEngagementRate]     = useState('')
  const [niche, setNiche]                       = useState('')
  const [country, setCountry]                   = useState('')
  const [age, setAge]                           = useState('')
  const [monthlyIncome, setMonthlyIncome]       = useState('')
  const [price, setPrice]                       = useState('')
  const [priceType, setPriceType]               = useState<PriceType>('fixed')
  const [platformUsername, setPlatformUsername] = useState('')

  if (!authLoading && !isAuthenticated) {
    router.push('/login')
    return null
  }

  const activePlatform = PLATFORMS.find(p => p.key === platform)

  const canNext0 = platform !== ''
  const canNext1 = title.trim() && description.trim() && followers.trim() && niche && platformUsername.trim()
  const canNext2 = price.trim() && Number(price) > 0

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post('/listings/create', {
        platform, title, description,
        followers: Number(followers.replace(/,/g, '')),
        engagementRate, niche, country, age, monthlyIncome,
        price: Number(price), priceType, platformUsername,
      })
      router.push('/my-listings?created=1')
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xeta bas verdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12">
      <div className="max-w-[640px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display font-black text-[32px] tracking-tight text-white leading-none">
            Elan Yerlesdiri
          </h1>
          <p className="text-slate-500 text-[13px] mt-2">
            Hesabini tehlukesiz sekilde sat — Escrow sistemi ile
          </p>
        </div>

        {/* Stepper — platform rəngi ilə */}
        <div
          className="flex items-center gap-2 mb-10 px-5 py-4 rounded-2xl relative overflow-hidden transition-all duration-500"
          style={{
            background: activePlatform ? activePlatform.bg : 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="absolute inset-0 bg-black/55" />

          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 relative z-10">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-display flex-shrink-0"
                  style={{
                    background: i < step ? '#f5c518' : i === step ? 'rgba(245,197,24,0.2)' : 'rgba(255,255,255,0.1)',
                    border:     `1px solid ${i <= step ? '#f5c518' : 'rgba(255,255,255,0.2)'}`,
                    color:      i < step ? '#000' : i === step ? '#f5c518' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span
                  className="text-[11px] font-medium hidden sm:block"
                  style={{ color: i === step ? '#f5c518' : 'rgba(255,255,255,0.5)' }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-px ml-2"
                  style={{ background: i < step ? 'rgba(245,197,24,0.5)' : 'rgba(255,255,255,0.15)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 0 — Platform ── */}
        {step === 0 && (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-500 mb-5">
              Platformu sec
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className="relative h-[90px] rounded-xl overflow-hidden transition-all group"
                  style={{
                    outline:       platform === p.key ? '2px solid #f5c518' : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                >
                  <div className="absolute inset-0" style={{ background: p.bg }} />
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    platform === p.key ? 'bg-black/20' : 'bg-black/50 group-hover:bg-black/30'
                  }`} />
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <span className="font-display font-black text-[14px]" style={{ color: p.accent }}>
                      {p.label}
                    </span>
                  </div>
                  {platform === p.key && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-[10px] font-black text-black">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1 — Melumatlar ── */}
        {step === 1 && (
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Platform rəngli arxa fon */}
            {activePlatform && (
              <>
                <div className="absolute inset-0" style={{ background: activePlatform.bg }} />
                <div className="absolute inset-0 bg-black/80" />
              </>
            )}
            {!activePlatform && (
              <div className="absolute inset-0 bg-white/[0.03]" />
            )}

            <div className="relative z-10">
              {/* Platform badge */}
              {activePlatform && (
                <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <span className="font-display font-black text-[12px]" style={{ color: activePlatform.accent }}>
                    {activePlatform.label}
                  </span>
                </div>
              )}

              <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-6">
                Hesab melumatlari
              </p>

              <div className="flex flex-col gap-5">

                <div>
                  <label className="block text-[11px] text-slate-400 mb-2">
                    {platform} istifadeci adi / URL *
                  </label>
                  <input className="input" placeholder="@username ve ya kanal linki" value={platformUsername} onChange={e => setPlatformUsername(e.target.value)} />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-2">Elan basligi *</label>
                  <input className="input" placeholder="Mes: Musigi sehifesi - 45K AZ auditoriya" value={title} onChange={e => setTitle(e.target.value)} maxLength={80} />
                  <p className="text-[10px] text-slate-600 text-right mt-1.5">{title.length}/80</p>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-2">Etrafly tesvir *</label>
                  <textarea className="input resize-none" rows={4} placeholder="Hesabin auditoriyasi, aktivliyi..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-2">Izleyici sayi *</label>
                    <input className="input" placeholder="45000" type="number" value={followers} onChange={e => setFollowers(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-2">Engagement Rate</label>
                    <input className="input" placeholder="4.8%" value={engagementRate} onChange={e => setEngagementRate(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-2">Hesab yasi</label>
                    <input className="input" placeholder="2 il" value={age} onChange={e => setAge(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-2">Aylig gelir (AZN)</label>
                    <input className="input" placeholder="120" type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-2">Nis *</label>
                    <select className="input cursor-pointer" value={niche} onChange={e => setNiche(e.target.value)}>
                      <option value="">Sec...</option>
                      {NICHES.map(n => <option key={n} value={n} className="bg-[#111]">{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-2">Esas olke</label>
                    <input className="input" placeholder="AZ, TR, EN..." value={country} onChange={e => setCountry(e.target.value)} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Qiymet ── */}
        {step === 2 && (
  <div className="flex flex-col gap-4">
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {activePlatform && (
        <>
          <div className="absolute inset-0" style={{ background: activePlatform.bg }} />
          <div className="absolute inset-0 bg-black/80" />
        </>
      )}
      {!activePlatform && <div className="absolute inset-0 bg-white/[0.03]" />}

      <div className="relative z-10">
        {activePlatform && (
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span className="font-display font-black text-[12px]" style={{ color: activePlatform.accent }}>
              {activePlatform.label}
            </span>
          </div>
        )}

        <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-6">
          Qiymet teyin et
        </p>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-[11px] text-slate-400 mb-2">Qiymet (AZN) *</label>
            <div className="relative">
              <input className="input pr-14" placeholder="350" type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-black font-display text-yellow-500">
                AZN
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-3">Qiymet novu</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { key: 'fixed',      label: 'Sabit Qiymet',         desc: 'Gosterilen qiymetten satilir'    },
                { key: 'negotiable', label: 'Muzakire Edile Biler', desc: 'Alici ile razilashmaq mumkundur' },
              ] as const).map(pt => (
                <button
                  key={pt.key}
                  onClick={() => setPriceType(pt.key)}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background: priceType === pt.key ? 'rgba(245,197,24,0.15)' : 'rgba(255,255,255,0.05)',
                    border:     `1px solid ${priceType === pt.key ? 'rgba(245,197,24,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <p className="font-display font-bold text-[12px] mb-1" style={{ color: priceType === pt.key ? '#f5c518' : '#f1f5f9' }}>
                    {pt.label}
                  </p>
                  <p className="text-[10px] text-slate-500">{pt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-yellow-500/[0.06] border border-yellow-500/20 rounded-2xl p-4 flex items-start gap-3">
      <span className="text-[18px]">🛡️</span>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Butun satislar <strong className="text-yellow-500">Escrow sistemi</strong> ile hayata kecirilir.
        Pul yalniz alici hesabi qebul etdikden sonra size kocurulur.
      </p>
    </div>
  </div>
)}

        {/* ── STEP 3 — Tesdiq ── */}
        {step === 3 && (
  <div className="flex flex-col gap-4">

    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {activePlatform && (
        <>
          <div className="absolute inset-0" style={{ background: activePlatform.bg }} />
          <div className="absolute inset-0 bg-black/80" />
        </>
      )}
      {!activePlatform && <div className="absolute inset-0 bg-white/[0.03]" />}

      <div className="relative z-10">
        {activePlatform && (
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span className="font-display font-black text-[12px]" style={{ color: activePlatform.accent }}>
              {activePlatform.label}
            </span>
          </div>
        )}

        <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-5">
          Elan xulasesi
        </p>

        <div className="flex flex-col">
          {[
            { label: 'Platform',    value: platform                                                               },
            { label: 'Baslig',      value: title                                                                  },
            { label: 'Izleyici',    value: followers                                                              },
            { label: 'Engagement',  value: engagementRate || '-'                                                  },
            { label: 'Nis',         value: niche                                                                  },
            { label: 'Olke',        value: country || '-'                                                         },
            { label: 'Hesab yasi',  value: age || '-'                                                             },
            { label: 'Aylig gelir', value: monthlyIncome ? `${monthlyIncome} AZN` : '-'                          },
            { label: 'Qiymet',      value: `${price} AZN (${priceType === 'fixed' ? 'sabit' : 'muzakireli'})`    },
          ].map(row => (
            <div key={row.label} className="flex justify-between py-2.5 border-b border-white/[0.08]">
              <span className="text-[12px] text-slate-500">{row.label}</span>
              <span className="text-[12px] font-medium text-white">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-green-500/[0.06] border border-green-500/20 rounded-2xl p-4 flex items-start gap-3">
      <span className="text-[18px]">✅</span>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Elaniniz moderasiya ucun gonderilechek. Tesdiqden sonra platformda gorunechek.
        Orta gozleme muddeti <strong className="text-white">24 saat</strong>-dir.
      </p>
    </div>
  </div>
)}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn-ghost text-[13px] py-2.5 px-6">
              ← Geri
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 0 && !canNext0) ||
                (step === 1 && !canNext1) ||
                (step === 2 && !canNext2)
              }
              className="btn-primary text-[13px] py-2.5 px-8"
            >
              Ireli →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary text-[13px] py-2.5 px-8"
            >
              {loading ? 'Gonderilit...' : '✓ Elani Yerlesdiri'}
            </button>
          )}
        </div>

      </div>
    </main>
  )
}