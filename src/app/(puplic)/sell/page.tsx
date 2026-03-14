'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../lib/api'


type Platform = 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'TELEGRAM' | 'FACEBOOK' | 'TWITTER'
type PriceType = 'fixed' | 'negotiable'

const PLATFORMS: { key: Platform; label: string; icon: string }[] = [
  { key: 'INSTAGRAM', label: 'Instagram', icon: '📸' },
  { key: 'TIKTOK',    label: 'TikTok',    icon: '🎵' },
  { key: 'YOUTUBE',   label: 'YouTube',   icon: '▶️' },
  { key: 'TELEGRAM',  label: 'Telegram',  icon: '💬' },
  { key: 'FACEBOOK',  label: 'Facebook',  icon: '👥' },
  { key: 'TWITTER',   label: 'Twitter/X', icon: '𝕏' },
]

const NICHES = [
  'Musiqi', 'Gözəllik', 'Fitness', 'Texnologiya', 'Gaming',
  'Yemək', 'Səyahət', 'Biznes', 'Xəbər', 'Kripto',
  'Lifestyle', 'Komedi', 'Təhsil', 'Digər',
]

const STEPS = ['Platform', 'Məlumatlar', 'Qiymət', 'Təsdiq']

export default function SellPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  const [step, setStep]             = useState(0)
  const [loading, setLoading]       = useState(false)

  // Form state
  const [platform, setPlatform]     = useState<Platform | ''>('')
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [followers, setFollowers]   = useState('')
  const [engagementRate, setEngagementRate] = useState('')
  const [niche, setNiche]           = useState('')
  const [country, setCountry]       = useState('')
  const [age, setAge]               = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [price, setPrice]           = useState('')
  const [priceType, setPriceType]   = useState<PriceType>('fixed')
  const [platformUsername, setPlatformUsername] = useState('')

  if (!authLoading && !isAuthenticated) {
    router.push('/login')
    return null
  }

  const canNextStep0 = platform !== ''
  const canNextStep1 = title.trim() && description.trim() && followers.trim() && niche && platformUsername.trim()
  const canNextStep2 = price.trim() && Number(price) > 0

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post('/listings/create', {
        platform,
        title,
        description,
        followers: Number(followers.replace(/,/g, '')),
        engagementRate,
        niche,
        country,
        age,
        monthlyIncome,
        price: Number(price),
        priceType,
        platformUsername,
      })
      router.push('/my-listings?created=1')
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="container mx-auto max-w-[640px]">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-display font-extrabold text-[28px] tracking-tight mb-1"
            style={{ color: 'var(--text)' }}
          >
            Elan Yerləşdir
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--text3)' }}>
            Hesabını təhlükəsiz şəkildə sat — Escrow sistemi ilə
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-display flex-shrink-0"
                  style={{
                    background: i < step ? 'var(--yellow)' : i === step ? 'var(--yellow-dim)' : 'var(--black3)',
                    border: `1px solid ${i <= step ? 'var(--yellow)' : 'var(--border)'}`,
                    color: i < step ? 'var(--black)' : i === step ? 'var(--yellow)' : 'var(--text3)',
                  }}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span
                  className="text-[11px] font-medium hidden sm:block"
                  style={{ color: i === step ? 'var(--yellow)' : 'var(--text3)' }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-px ml-2"
                  style={{ background: i < step ? 'var(--yellow-border)' : 'var(--border)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 0 — Platform ── */}
        {step === 0 && (
          <div
            className="rounded-2xl p-6"
            style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
          >
            <p
              className="font-display font-bold text-[11px] uppercase tracking-widest mb-4"
              style={{ color: 'var(--text3)' }}
            >
              Platformu seç
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                  style={{
                    background: platform === p.key ? 'var(--yellow-dim)' : 'var(--black3)',
                    border: `1px solid ${platform === p.key ? 'var(--yellow)' : 'var(--border)'}`,
                  }}
                >
                  <span className="text-[24px]">{p.icon}</span>
                  <span
                    className="text-[12px] font-bold font-display"
                    style={{ color: platform === p.key ? 'var(--yellow)' : 'var(--text2)' }}
                  >
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1 — Məlumatlar ── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">

            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <p
                className="font-display font-bold text-[11px] uppercase tracking-widest mb-4"
                style={{ color: 'var(--text3)' }}
              >
                Hesab məlumatları
              </p>

              <div className="flex flex-col gap-4">

                <div>
                  <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                    {platform} istifadəçi adı / URL *
                  </label>
                  <input
                    className="input"
                    placeholder="@username və ya kanal linki"
                    value={platformUsername}
                    onChange={e => setPlatformUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                    Elan başlığı *
                  </label>
                  <input
                    className="input"
                    placeholder="Məs: Musiqi səhifəsi – 45K AZ auditoriya"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={80}
                  />
                  <p className="text-[10px] mt-1 text-right" style={{ color: 'var(--text3)' }}>
                    {title.length}/80
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                    Ətraflı təsvir *
                  </label>
                  <textarea
                    className="input resize-none"
                    rows={4}
                    placeholder="Hesabın auditoriyası, aktivliyi, niyə satırsınız..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                      İzləyici sayı *
                    </label>
                    <input
                      className="input"
                      placeholder="45000"
                      type="number"
                      value={followers}
                      onChange={e => setFollowers(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                      Engagement Rate
                    </label>
                    <input
                      className="input"
                      placeholder="4.8%"
                      value={engagementRate}
                      onChange={e => setEngagementRate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                      Hesab yaşı
                    </label>
                    <input
                      className="input"
                      placeholder="2 il"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                      Aylıq gəlir (AZN)
                    </label>
                    <input
                      className="input"
                      placeholder="120"
                      type="number"
                      value={monthlyIncome}
                      onChange={e => setMonthlyIncome(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                      Niş *
                    </label>
                    <select
                      className="input"
                      value={niche}
                      onChange={e => setNiche(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">Seç...</option>
                      {NICHES.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                      Əsas ölkə
                    </label>
                    <input
                      className="input"
                      placeholder="AZ, TR, EN..."
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Qiymət ── */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <p
                className="font-display font-bold text-[11px] uppercase tracking-widest mb-4"
                style={{ color: 'var(--text3)' }}
              >
                Qiymət təyin et
              </p>

              <div className="flex flex-col gap-4">

                <div>
                  <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                    Qiymət (AZN) *
                  </label>
                  <div className="relative">
                    <input
                      className="input pr-14"
                      placeholder="350"
                      type="number"
                      min="1"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                    />
                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold font-display"
                      style={{ color: 'var(--yellow)' }}
                    >
                      AZN
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] mb-3" style={{ color: 'var(--text3)' }}>
                    Qiymət növü
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { key: 'fixed',      label: 'Sabit Qiymət',  desc: 'Göstərilən qiymətdən satılır' },
                      { key: 'negotiable', label: 'Müzakirə Edilə Bilər', desc: 'Alıcı ilə razılaşmaq mümkündür' },
                    ] as const).map(pt => (
                      <button
                        key={pt.key}
                        onClick={() => setPriceType(pt.key)}
                        className="p-4 rounded-xl text-left transition-all"
                        style={{
                          background: priceType === pt.key ? 'var(--yellow-dim)' : 'var(--black3)',
                          border: `1px solid ${priceType === pt.key ? 'var(--yellow)' : 'var(--border)'}`,
                        }}
                      >
                        <p
                          className="font-display font-bold text-[12px] mb-1"
                          style={{ color: priceType === pt.key ? 'var(--yellow)' : 'var(--text)' }}
                        >
                          {pt.label}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                          {pt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Escrow xatırlatma */}
            <div
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: 'var(--yellow-dim)', border: '1px solid var(--yellow-border)' }}
            >
              <span className="text-[18px]">🛡️</span>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                Bütün satışlar <strong style={{ color: 'var(--yellow)' }}>Escrow sistemi</strong> ilə
                həyata keçirilir. Pul yalnız alıcı hesabı qəbul etdikdən sonra sizə köçürülür.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Təsdiq ── */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <p
                className="font-display font-bold text-[11px] uppercase tracking-widest mb-4"
                style={{ color: 'var(--text3)' }}
              >
                Elan xülasəsi
              </p>

              <div className="flex flex-col gap-3">
                {[
                  { label: 'Platform',    value: platform     },
                  { label: 'Başlıq',      value: title        },
                  { label: 'İzləyici',    value: followers    },
                  { label: 'Engagement',  value: engagementRate || '—' },
                  { label: 'Niş',         value: niche        },
                  { label: 'Ölkə',        value: country || '—' },
                  { label: 'Hesab yaşı',  value: age || '—'   },
                  { label: 'Aylıq gəlir', value: monthlyIncome ? `${monthlyIncome} AZN` : '—' },
                  { label: 'Qiymət',      value: `${price} AZN (${priceType === 'fixed' ? 'sabit' : 'müzakirəli'})` },
                ].map(row => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center py-2"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <span className="text-[12px]" style={{ color: 'var(--text3)' }}>{row.label}</span>
                    <span className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <span className="text-[18px]">✅</span>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                Elanınız moderasiya üçün göndəriləcək. Təsdiqdən sonra platformda görünəcək.
                Orta gözləmə müddəti <strong style={{ color: 'var(--text)' }}>24 saat</strong>-dır.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="btn-ghost px-6 py-2.5 text-[13px]"
            >
              ← Geri
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 0 && !canNextStep0) ||
                (step === 1 && !canNextStep1) ||
                (step === 2 && !canNextStep2)
              }
              className="btn-primary px-8 py-2.5 text-[13px]"
            >
              İrəli →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary px-8 py-2.5 text-[13px]"
            >
              {loading ? 'Göndərilir...' : '✓ Elanı Yerləşdir'}
            </button>
          )}
        </div>

      </div>
    </main>
  )
}