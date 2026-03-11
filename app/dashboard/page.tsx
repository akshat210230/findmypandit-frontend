'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getMyBookings } from '@/lib/api'
import SacredLoader from '@/components/ui/SacredLoader'

function BookingModal({ booking: b, onClose }: { booking: any; onClose: () => void }) {
  const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    PENDING:   { label: 'Awaiting Confirmation', color: 'var(--yellow)',  bg: 'var(--yellow-s)',  border: 'rgba(192,128,16,0.2)' },
    CONFIRMED: { label: 'Confirmed',              color: 'var(--green)',   bg: 'var(--green-s)',   border: 'rgba(46,125,82,0.2)'  },
    COMPLETED: { label: 'Completed',              color: 'var(--blue)',    bg: 'var(--blue-s)',    border: 'rgba(42,95,168,0.2)'  },
    CANCELLED: { label: 'Cancelled',              color: 'var(--red)',     bg: 'var(--red-s)',     border: 'rgba(184,50,50,0.2)'  },
  }
  const s = statusConfig[b.status] ?? { label: b.status, color: 'var(--text-on-light2)', bg: 'rgba(44,26,8,0.06)', border: 'var(--card-border)' }

  const panditName = b.pandit?.user?.firstName ? `Pt. ${b.pandit.user.firstName} ${b.pandit.user.lastName}` : 'Pandit'
  const dateStr = new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const samagriItems: any[] = b.samagriItems ?? []
  const samagriTotal = samagriItems.reduce((sum: number, i: any) => sum + (i.estimatedPrice ?? 0) * (i.qty ?? 1), 0)
  const panditFee = b.agreedPrice ?? b.totalAmount ?? 0
  const total = b.totalAmount ?? panditFee + samagriTotal

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(44,26,8,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} className="card-light" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--r)' }}>

        {/* Modal header */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <span className="badge mb-2" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-on-light)', lineHeight: 1.2, display: 'block', marginTop: 6 }}>
              {b.service?.name || b.ceremony?.name || 'Sacred Ceremony'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'var(--accent-bg)', border: 'none', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '0.9rem', flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Pandit */}
          <ModalSection icon="🙏" title="Pandit">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--accent), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                {b.pandit?.user?.firstName?.[0]}{b.pandit?.user?.lastName?.[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-on-light)', fontSize: '0.95rem' }}>{panditName}</div>
                {b.pandit?.city && <div style={{ fontSize: '0.8rem', color: 'var(--text-on-light2)' }}>{b.pandit.city}{b.pandit.experienceYears ? ` · ${b.pandit.experienceYears} yrs exp` : ''}</div>}
                {b.pandit?.rating > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>★ {b.pandit.rating.toFixed(1)}</div>}
              </div>
            </div>
          </ModalSection>

          {/* Date & Time */}
          <ModalSection icon="📅" title="Date & Time">
            <ModalRow label="Date" value={dateStr} />
            {b.startTime && <ModalRow label="Time" value={b.startTime} />}
            {b.choghadiya && <ModalRow label="Muhurat" value={`🕉️ ${b.choghadiya}`} />}
          </ModalSection>

          {/* Address */}
          {b.address && (
            <ModalSection icon="📍" title="Ceremony Address">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)', lineHeight: 1.6 }}>{b.address}</p>
            </ModalSection>
          )}

          {/* Samagri */}
          {samagriItems.length > 0 && (
            <ModalSection icon="🪔" title="Samagri Items">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {samagriItems.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <span style={{ color: 'var(--text-on-light)' }}>{item.name} {item.qty > 1 ? `×${item.qty}` : ''}</span>
                    <span style={{ color: 'var(--text-on-light2)' }}>₹{(item.estimatedPrice * (item.qty ?? 1)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </ModalSection>
          )}

          {/* Price Breakdown */}
          <ModalSection icon="💰" title="Price Breakdown">
            <ModalRow label="Pandit fee" value={`₹${panditFee.toLocaleString()}`} />
            {samagriTotal > 0 && <ModalRow label="Samagri" value={`₹${samagriTotal.toLocaleString()}`} />}
            <div style={{ borderTop: '1px solid var(--card-border)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-on-light)', fontSize: '0.9rem' }}>Total Paid</span>
              <span className="price-serif" style={{ fontSize: '1.1rem' }}>₹{total.toLocaleString()}</span>
            </div>
          </ModalSection>

          <p style={{ fontSize: '0.68rem', color: 'var(--text-on-light3)', textAlign: 'center', letterSpacing: '0.5px' }}>
            Booking ID: {b.id}
          </p>
        </div>
      </div>
    </div>
  )
}

function ModalSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(44,26,8,0.03)', borderRadius: 'var(--r-sm)', padding: '14px 16px', border: '1px solid var(--card-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: '0.9rem' }}>{icon}</span>
        <span className="eyebrow">{title}</span>
      </div>
      {children}
    </div>
  )
}

function ModalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.85rem', marginBottom: 4 }}>
      <span style={{ color: 'var(--text-on-light2)' }}>{label}</span>
      <span style={{ color: 'var(--text-on-light)', fontWeight: 600 }}>{value}</span>
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
    if (!token) { router.push('/login'); return }
    if (stored) setUser(JSON.parse(stored))
    const fetchBookings = async () => {
      try {
        const res = await getMyBookings()
        setBookings(res.data.bookings || res.data || [])
      } catch (err) { console.error('Failed to load bookings') }
      setLoading(false)
    }
    fetchBookings()
  }, [router])

  const now = new Date()
  const upcoming = bookings.filter(b => new Date(b.bookingDate) >= now && b.status !== 'CANCELLED')
  const past = bookings.filter(b => new Date(b.bookingDate) < now || b.status === 'CANCELLED' || b.status === 'COMPLETED')
  const displayed = tab === 'upcoming' ? upcoming : past

  const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    PENDING:   { label: 'Pending',   color: 'var(--yellow)',  bg: 'var(--yellow-s)',  border: 'rgba(192,128,16,0.2)' },
    CONFIRMED: { label: 'Confirmed', color: 'var(--green)',   bg: 'var(--green-s)',   border: 'rgba(46,125,82,0.2)'  },
    COMPLETED: { label: 'Completed', color: 'var(--blue)',    bg: 'var(--blue-s)',    border: 'rgba(42,95,168,0.2)'  },
    CANCELLED: { label: 'Cancelled', color: 'var(--red)',     bg: 'var(--red-s)',     border: 'rgba(184,50,50,0.2)'  },
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      {selectedBooking && <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

      <div className="max-w-4xl mx-auto">
        <div className="pt-6 mb-8">
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: 'var(--text-on-light)', marginBottom: 4 }}>
            {user?.role === 'PANDIT' ? 'Pandit Dashboard' : 'My Bookings'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)' }}>
            Welcome back, {user?.firstName || 'User'}!
            {user?.role === 'PANDIT' && (
              <button onClick={() => router.push('/pandit-dashboard')} className="ml-4 font-semibold" style={{ color: 'var(--accent)' }}>
                Go to Pandit Dashboard →
              </button>
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['upcoming', 'past'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--text-on-light2)',
                border: tab === t ? 'none' : '1.5px solid var(--card-border)',
                borderRadius: 'var(--r-pill)',
                boxShadow: tab === t ? '0 3px 12px rgba(200,72,0,0.22)' : 'none',
              }}>
              {t === 'upcoming' ? 'Upcoming' : 'Past'} ({t === 'upcoming' ? upcoming.length : past.length})
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading ? (
          <SacredLoader message="Loading your bookings…" size="md" />
        ) : displayed.length === 0 ? (
          <div className="card-light text-center p-12" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="text-5xl mb-4">{tab === 'upcoming' ? '📅' : '📋'}</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-on-light)', marginBottom: 8 }}>
              {tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-on-light2)' }}>
              {tab === 'upcoming' ? "You haven't booked any ceremony yet." : 'Your completed bookings will appear here.'}
            </p>
            {tab === 'upcoming' && (
              <button onClick={() => router.push('/search')} className="btn-primary">Find a Pandit</button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((b: any) => {
              const s = statusConfig[b.status] ?? { label: b.status, color: 'var(--text-on-light2)', bg: 'rgba(44,26,8,0.06)', border: 'var(--card-border)' }
              const panditName = b.pandit?.user?.firstName ? `Pt. ${b.pandit.user.firstName} ${b.pandit.user.lastName}` : 'Pandit'
              return (
                <div key={b.id} onClick={() => setSelectedBooking(b)}
                  className="card-light p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  style={{ boxShadow: 'var(--shadow)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>🙏</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-on-light)' }}>
                          {b.service?.name || b.ceremony?.name || 'Ceremony'}
                        </h3>
                        <span className="badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-on-light2)' }}>
                        {panditName}{b.pandit?.city ? ` · ${b.pandit.city}` : ''}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-on-light3)', marginTop: 3 }}>
                        📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        {b.startTime && ` · ⏰ ${b.startTime}`}
                        {b.choghadiya && ` · 🕉️ ${b.choghadiya}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="price-serif" style={{ fontSize: '1.1rem' }}>₹{b.totalAmount?.toLocaleString()}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-on-light3)' }}>View details →</span>
                    </div>
                  </div>
                  {b.address && (
                    <div className="mt-3 pt-3 text-sm" style={{ borderTop: '1px solid var(--card-border)', color: 'var(--text-on-light3)' }}>
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
