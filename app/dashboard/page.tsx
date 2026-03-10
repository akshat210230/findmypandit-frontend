'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getMyBookings } from '@/lib/api'
import SacredLoader from '@/components/ui/SacredLoader'

function BookingModal({ booking: b, onClose }: { booking: any; onClose: () => void }) {
  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING:   { label: 'Awaiting Confirmation', color: '#92600A', bg: 'rgba(212,160,23,0.12)' },
    CONFIRMED: { label: 'Confirmed',              color: '#1A6B3A', bg: 'rgba(74,158,90,0.12)'  },
    COMPLETED: { label: 'Completed',              color: '#1A4A7A', bg: 'rgba(74,128,192,0.12)' },
    CANCELLED: { label: 'Cancelled',              color: '#7A1A1A', bg: 'rgba(192,80,80,0.12)'  },
  }
  const s = statusConfig[b.status] ?? { label: b.status, color: '#7A6350', bg: 'rgba(180,130,80,0.1)' }

  const panditName = b.pandit?.user?.firstName
    ? `Pt. ${b.pandit.user.firstName} ${b.pandit.user.lastName}`
    : 'Pandit'

  const dateStr = new Date(b.bookingDate).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const samagriItems: any[] = b.samagriItems ?? []
  const samagriTotal = samagriItems.reduce((sum: number, i: any) => sum + (i.estimatedPrice ?? 0) * (i.qty ?? 1), 0)
  const panditFee = b.agreedPrice ?? b.totalAmount ?? 0
  const total = b.totalAmount ?? panditFee + samagriTotal

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(30,10,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFAF5',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(80,40,10,0.25)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px',
          borderBottom: '1px solid rgba(180,130,80,0.1)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 99,
              background: s.bg, color: s.color,
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              {s.label}
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, color: '#2C1810', lineHeight: 1.2 }}>
              {b.service?.name || b.ceremony?.name || 'Sacred Ceremony'}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(180,130,80,0.08)', border: 'none', cursor: 'pointer',
            width: 32, height: 32, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#7A6350', fontSize: '1rem', flexShrink: 0,
          }}>✕</button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Pandit Info */}
          <Section icon="🙏" title="Pandit">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #D4651E, #B8860B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '0.9rem',
              }}>
                {b.pandit?.user?.firstName?.[0]}{b.pandit?.user?.lastName?.[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#2C1810', fontSize: '0.95rem' }}>{panditName}</div>
                {b.pandit?.city && (
                  <div style={{ fontSize: '0.8rem', color: '#7A6350' }}>{b.pandit.city}{b.pandit.experienceYears ? ` · ${b.pandit.experienceYears} yrs exp` : ''}</div>
                )}
                {b.pandit?.rating > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#D4A017' }}>★ {b.pandit.rating.toFixed(1)}</div>
                )}
              </div>
            </div>
          </Section>

          {/* Date & Time */}
          <Section icon="📅" title="Date & Time">
            <Row label="Date" value={dateStr} />
            {b.startTime && <Row label="Time" value={b.startTime} />}
            {b.choghadiya && <Row label="Muhurat" value={`🕉️ ${b.choghadiya}`} />}
          </Section>

          {/* Location */}
          {b.address && (
            <Section icon="📍" title="Ceremony Address">
              <p style={{ fontSize: '0.875rem', color: '#4A3728', lineHeight: 1.6 }}>{b.address}</p>
            </Section>
          )}

          {/* Samagri */}
          {samagriItems.length > 0 && (
            <Section icon="🪔" title="Samagri Items">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {samagriItems.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <span style={{ color: '#4A3728' }}>{item.name} {item.qty > 1 ? `×${item.qty}` : ''}</span>
                    <span style={{ color: '#7A6350' }}>₹{(item.estimatedPrice * (item.qty ?? 1)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Price Breakdown */}
          <Section icon="💰" title="Price Breakdown">
            <Row label="Pandit fee" value={`₹${panditFee.toLocaleString()}`} />
            {samagriTotal > 0 && <Row label="Samagri" value={`₹${samagriTotal.toLocaleString()}`} />}
            <div style={{ borderTop: '1px solid rgba(180,130,80,0.12)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#2C1810', fontSize: '0.9rem' }}>Total Paid</span>
              <span style={{ fontWeight: 700, color: '#D4651E', fontSize: '1rem' }}>₹{total.toLocaleString()}</span>
            </div>
          </Section>

          {/* Booking ID */}
          <p style={{ fontSize: '0.7rem', color: '#B09980', textAlign: 'center', letterSpacing: '0.5px' }}>
            Booking ID: {b.id}
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(180,130,80,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: '0.9rem' }}>{icon}</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#B09980' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.85rem', marginBottom: 4 }}>
      <span style={{ color: '#7A6350' }}>{label}</span>
      <span style={{ color: '#2C1810', fontWeight: 600 }}>{value}</span>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (!token) {
      router.push('/login')
      return
    }
    if (stored) setUser(JSON.parse(stored))

    const fetchBookings = async () => {
      try {
        const res = await getMyBookings()
        setBookings(res.data.bookings || res.data || [])
      } catch (err) {
        console.error('Failed to load bookings')
      }
      setLoading(false)
    }
    fetchBookings()
  }, [router])

  const now = new Date()
  const upcoming = bookings.filter(b => new Date(b.bookingDate) >= now && b.status !== 'CANCELLED')
  const past = bookings.filter(b => new Date(b.bookingDate) < now || b.status === 'CANCELLED' || b.status === 'COMPLETED')
  const displayed = tab === 'upcoming' ? upcoming : past

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING:   { label: 'Pending',   color: '#92600A', bg: 'rgba(212,160,23,0.12)' },
    CONFIRMED: { label: 'Confirmed', color: '#1A6B3A', bg: 'rgba(74,158,90,0.12)'  },
    COMPLETED: { label: 'Completed', color: '#1A4A7A', bg: 'rgba(74,128,192,0.12)' },
    CANCELLED: { label: 'Cancelled', color: '#7A1A1A', bg: 'rgba(192,80,80,0.12)'  },
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4" style={{ background: '#FFFAF5' }}>
      {selectedBooking && (
        <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <div className="pt-6 mb-8">
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: '#2C1810' }}>
            {user?.role === 'PANDIT' ? 'Pandit Dashboard' : 'My Bookings'}
          </h1>
          <p className="text-sm" style={{ color: '#7A6350' }}>
            Welcome back, {user?.firstName || 'User'}!
            {user?.role === 'PANDIT' && (
              <button onClick={() => router.push('/pandit-dashboard')} className="ml-4 font-semibold hover:underline" style={{ color: '#D4651E' }}>
                Go to Pandit Dashboard →
              </button>
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['upcoming', 'past'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg, #D4651E, #C05818)' : '#fff',
                color: tab === t ? '#fff' : '#7A6350',
                border: tab === t ? 'none' : '1.5px solid rgba(180,130,80,0.15)',
                boxShadow: tab === t ? '0 3px 12px rgba(212,101,30,0.2)' : 'none',
              }}>
              {t === 'upcoming' ? 'Upcoming' : 'Past'} ({t === 'upcoming' ? upcoming.length : past.length})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <SacredLoader message="Loading your bookings..." size="md" />
        ) : displayed.length === 0 ? (
          <div className="p-12 rounded-2xl text-center" style={{ background: '#fff', border: '1px solid rgba(180,130,80,0.08)' }}>
            <div className="text-5xl mb-4">{tab === 'upcoming' ? '📅' : '📋'}</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#2C1810' }}>
              {tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            </h3>
            <p className="text-sm mb-6" style={{ color: '#7A6350' }}>
              {tab === 'upcoming' ? "You haven't booked any ceremony yet." : 'Your completed bookings will appear here.'}
            </p>
            {tab === 'upcoming' && (
              <button onClick={() => router.push('/search')}
                className="px-6 py-3 rounded-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)', boxShadow: '0 4px 16px rgba(212,101,30,0.15)' }}>
                Find a Pandit
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((b: any) => {
              const s = statusConfig[b.status] ?? { label: b.status, color: '#7A6350', bg: 'rgba(180,130,80,0.1)' }
              const panditName = b.pandit?.user?.firstName
                ? `Pt. ${b.pandit.user.firstName} ${b.pandit.user.lastName}`
                : 'Pandit'
              return (
                <div key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: '#fff', border: '1px solid rgba(180,130,80,0.08)', boxShadow: '0 2px 12px rgba(120,80,30,0.03)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: 'rgba(212,101,30,0.06)' }}>
                      🙏
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold" style={{ color: '#2C1810' }}>
                          {b.service?.name || b.ceremony?.name || 'Ceremony'}
                        </h3>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                          padding: '2px 8px', borderRadius: 99, background: s.bg, color: s.color,
                        }}>
                          {s.label}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#7A6350' }}>
                        {panditName}{b.pandit?.city ? ` · ${b.pandit.city}` : ''}
                      </p>
                      <p className="text-sm mt-1" style={{ color: '#B09980' }}>
                        📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        {b.startTime && ` · ⏰ ${b.startTime}`}
                        {b.choghadiya && ` · 🕉️ ${b.choghadiya}`}
                      </p>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="text-lg font-bold" style={{ color: '#D4651E' }}>
                        ₹{b.totalAmount?.toLocaleString()}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: '#B09980' }}>View details →</span>
                    </div>
                  </div>

                  {b.address && (
                    <div className="mt-3 pt-3 text-sm" style={{ borderTop: '1px solid rgba(180,130,80,0.07)', color: '#B09980' }}>
                      📍 {b.address}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
