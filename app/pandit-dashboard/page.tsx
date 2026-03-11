'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getMyBookings, updateBookingStatus, updatePanditProfile } from '@/lib/api'
import api from '@/lib/api'
import SacredLoader from '@/components/ui/SacredLoader'

export default function PanditDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [pandit, setPandit] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'bookings' | 'profile'>('bookings')
  const [actionLoading, setActionLoading] = useState('')
  const [message, setMessage] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [profileForm, setProfileForm] = useState({
    bio: '', experienceYears: 0, city: '', state: '', priceMin: 0, priceMax: 0,
    languages: '', specializations: '', isAvailable: true,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (!token || !stored) { router.push('/login'); return }
    const userData = JSON.parse(stored)
    if (userData.role !== 'PANDIT') { router.push('/dashboard'); return }
    setUser(userData)
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const profileRes = await api.get('/pandits/me')
      const panditData = profileRes.data.pandit
      setPandit(panditData)
      setProfileForm({
        bio: panditData.bio || '',
        experienceYears: panditData.experienceYears || 0,
        city: panditData.city || '',
        state: panditData.state || '',
        priceMin: panditData.priceMin || 0,
        priceMax: panditData.priceMax || 0,
        languages: (panditData.languages || []).join(', '),
        specializations: (panditData.specializations || []).join(', '),
        isAvailable: panditData.isAvailable ?? true,
      })
      const bookingsRes = await getMyBookings()
      setBookings(bookingsRes.data.bookings || bookingsRes.data || [])
    } catch (err) { console.error('Failed to load pandit data') }
    setLoading(false)
  }

  const handleBookingAction = async (bookingId: string, status: string) => {
    setActionLoading(bookingId); setMessage('')
    try {
      await updateBookingStatus(bookingId, { status })
      setMessage(`Booking ${status.toLowerCase()} successfully!`)
      fetchData()
    } catch (err: any) { setMessage(err.response?.data?.error || 'Action failed') }
    setActionLoading('')
  }

  const handleProfileSave = async () => {
    setMessage('')
    try {
      await updatePanditProfile({
        ...profileForm,
        languages: profileForm.languages.split(',').map(l => l.trim()).filter(Boolean),
        specializations: profileForm.specializations.split(',').map(s => s.trim()).filter(Boolean),
      })
      setMessage('Profile updated successfully!')
      setEditMode(false)
      fetchData()
    } catch (err: any) { setMessage(err.response?.data?.error || 'Failed to update profile') }
  }

  if (loading) return <SacredLoader message="Loading dashboard…" size="lg" />

  const pending = bookings.filter(b => b.status === 'PENDING')
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED')
  const others = bookings.filter(b => b.status !== 'PENDING' && b.status !== 'CONFIRMED')

  const inputClass = "w-full"
  const inputStyle = { padding: '11px 16px' }
  const labelStyle: React.CSSProperties = { fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--text-on-light2)', display: 'block', marginBottom: 6 }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="pt-6 mb-6">
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: 'var(--text-on-light)', marginBottom: 4 }}>
            Pandit Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)' }}>
            Welcome, Pt. {user?.firstName} {user?.lastName}
          </p>
        </div>

        {message && (
          <div className="p-3 rounded-lg text-sm mb-4"
            style={message.includes('success') ? { background: 'var(--green-s)', color: 'var(--green)', border: '1px solid rgba(46,125,82,0.2)' } : { background: 'var(--red-s)', color: 'var(--red)', border: '1px solid rgba(184,50,50,0.2)' }}>
            {message}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { val: pending.length, label: 'Pending', color: 'var(--yellow)' },
            { val: confirmed.length, label: 'Confirmed', color: 'var(--green)' },
            { val: pandit?.rating > 0 ? pandit.rating.toFixed(1) : '—', label: 'Rating', color: 'var(--gold)' },
            { val: pandit?.totalReviews || 0, label: 'Reviews', color: 'var(--blue)' },
          ].map((stat, i) => (
            <div key={i} className="card-light text-center p-4" style={{ boxShadow: 'var(--shadow)' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.6rem', color: stat.color, lineHeight: 1 }}>
                {stat.val}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-on-light3)', marginTop: 4, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['bookings', 'profile'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2.5 text-sm font-semibold transition-all capitalize"
              style={{
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--text-on-light2)',
                border: tab === t ? 'none' : '1.5px solid var(--card-border)',
                borderRadius: 'var(--r-pill)',
                boxShadow: tab === t ? '0 3px 12px rgba(200,72,0,0.22)' : 'none',
              }}>
              {t === 'bookings' ? `Bookings (${bookings.length})` : 'My Profile'}
            </button>
          ))}
        </div>

        {/* ─── BOOKINGS TAB ─── */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {/* Pending */}
            {pending.length > 0 && (
              <div className="mb-2">
                <span className="eyebrow block mb-3">⏳ Pending — Action Required</span>
                {pending.map((b: any) => (
                  <div key={b.id} className="card-light p-5 mb-3"
                    style={{ boxShadow: 'var(--shadow)', border: '2px solid rgba(192,128,16,0.3)' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-on-light)', marginBottom: 4 }}>
                          {b.service?.name || b.ceremony?.name || 'Ceremony'}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-on-light2)', marginBottom: 2 }}>
                          👤 {b.user?.firstName} {b.user?.lastName} · 📍 {b.address}, {b.city}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-on-light3)' }}>
                          📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          {b.startTime && ` · ⏰ ${b.startTime}`}
                          {b.choghadiya && ` · 🕉️ ${b.choghadiya}`}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button onClick={() => handleBookingAction(b.id, 'CONFIRMED')} disabled={actionLoading === b.id}
                          className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                          {actionLoading === b.id ? '…' : '✓ Accept'}
                        </button>
                        <button onClick={() => handleBookingAction(b.id, 'CANCELLED')} disabled={actionLoading === b.id}
                          className="btn-outline" style={{ padding: '7px 16px', fontSize: '0.82rem' }}>
                          ✗ Decline
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="price-serif" style={{ fontSize: '1.1rem' }}>₹{b.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Confirmed */}
            {confirmed.length > 0 && (
              <div className="mb-2">
                <span className="eyebrow block mb-3">✅ Confirmed</span>
                {confirmed.map((b: any) => (
                  <div key={b.id} className="card-light p-5 mb-3"
                    style={{ boxShadow: 'var(--shadow)', border: '1.5px solid rgba(46,125,82,0.25)' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-on-light)', marginBottom: 4 }}>
                          {b.service?.name || b.ceremony?.name || 'Ceremony'}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-on-light2)', marginBottom: 2 }}>
                          👤 {b.user?.firstName} {b.user?.lastName} · 📍 {b.address}, {b.city}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-on-light3)' }}>
                          📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          {b.startTime && ` · ⏰ ${b.startTime}`}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="price-serif" style={{ fontSize: '1.1rem' }}>₹{b.totalAmount?.toLocaleString()}</span>
                        <div className="mt-2">
                          <button onClick={() => handleBookingAction(b.id, 'COMPLETED')} disabled={actionLoading === b.id}
                            className="btn-outline" style={{ padding: '5px 14px', fontSize: '0.78rem' }}>
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past */}
            {others.length > 0 && (
              <div>
                <span className="eyebrow block mb-3">Past Bookings</span>
                {others.map((b: any) => (
                  <div key={b.id} className="card-light p-5 mb-3" style={{ boxShadow: 'var(--shadow)', opacity: 0.75 }}>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-on-light)' }}>
                          {b.service?.name || b.ceremony?.name || 'Ceremony'}
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-on-light3)', marginTop: 2 }}>
                          {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <span className="badge"
                        style={{ background: 'rgba(44,26,8,0.06)', color: 'var(--text-on-light2)', border: '1px solid var(--card-border)' }}>
                        {b.status}
                      </span>
                      <span className="price-serif" style={{ fontSize: '0.95rem' }}>₹{b.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bookings.length === 0 && (
              <div className="card-light text-center p-12" style={{ boxShadow: 'var(--shadow)' }}>
                <div className="text-5xl mb-4">📭</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-on-light)', marginBottom: 8 }}>
                  No bookings yet
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)' }}>
                  When families book you, their requests will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── PROFILE TAB ─── */}
        {tab === 'profile' && (
          <div className="card-light p-6" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-on-light)' }}>
                My Profile
              </h2>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditMode(false)} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                    Cancel
                  </button>
                  <button onClick={handleProfileSave} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label style={labelStyle}>Bio</label>
                  <textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                    rows={3} className={inputClass} style={{ ...inputStyle, resize: 'none' }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>City</label>
                    <input value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <input value={profileForm.state} onChange={e => setProfileForm({...profileForm, state: e.target.value})} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Experience (years)</label>
                  <input type="number" value={profileForm.experienceYears} onChange={e => setProfileForm({...profileForm, experienceYears: parseInt(e.target.value) || 0})} className={inputClass} style={inputStyle} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Min Price (₹)</label>
                    <input type="number" value={profileForm.priceMin} onChange={e => setProfileForm({...profileForm, priceMin: parseInt(e.target.value) || 0})} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Max Price (₹)</label>
                    <input type="number" value={profileForm.priceMax} onChange={e => setProfileForm({...profileForm, priceMax: parseInt(e.target.value) || 0})} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Languages (comma separated)</label>
                  <input value={profileForm.languages} onChange={e => setProfileForm({...profileForm, languages: e.target.value})} placeholder="Hindi, Sanskrit, English" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Specializations (comma separated)</label>
                  <input value={profileForm.specializations} onChange={e => setProfileForm({...profileForm, specializations: e.target.value})} placeholder="Weddings, Griha Pravesh, Ganesh Puja" className={inputClass} style={inputStyle} />
                </div>
                <div className="flex items-center gap-3">
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Available for bookings</label>
                  <button onClick={() => setProfileForm({...profileForm, isAvailable: !profileForm.isAvailable})}
                    style={{ width: 48, height: 26, borderRadius: 99, border: 'none', cursor: 'pointer', background: profileForm.isAvailable ? 'var(--green)' : 'rgba(44,26,8,0.15)', position: 'relative', transition: 'background .2s' }}>
                    <div style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', position: 'absolute', top: 3, left: profileForm.isAvailable ? 25 : 3, transition: 'left .2s' }} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <span className="eyebrow block mb-2">Bio</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-on-light2)', lineHeight: 1.65 }}>{pandit?.bio || 'No bio added'}</p>
                </div>
                <div style={{ height: 1, background: 'var(--card-border)' }} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="eyebrow block mb-1.5">Location</span>
                    <p style={{ fontWeight: 600, color: 'var(--text-on-light)', fontSize: '0.9rem' }}>{pandit?.city}, {pandit?.state}</p>
                  </div>
                  <div>
                    <span className="eyebrow block mb-1.5">Experience</span>
                    <p style={{ fontWeight: 600, color: 'var(--text-on-light)', fontSize: '0.9rem' }}>{pandit?.experienceYears} years</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="eyebrow block mb-1.5">Price Range</span>
                    <p className="price-serif" style={{ fontSize: '1.05rem' }}>₹{pandit?.priceMin?.toLocaleString()} – ₹{pandit?.priceMax?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="eyebrow block mb-1.5">Status</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: pandit?.isAvailable ? 'var(--green)' : 'var(--red)' }}>
                      {pandit?.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="eyebrow block mb-2">Languages</span>
                  <div className="flex flex-wrap gap-2">
                    {(pandit?.languages || []).map((l: string, i: number) => (
                      <span key={i} className="badge" style={{ background: 'var(--blue-s)', color: 'var(--blue)', border: '1px solid rgba(42,95,168,0.2)' }}>{l}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="eyebrow block mb-2">Specializations</span>
                  <div className="flex flex-wrap gap-2">
                    {(pandit?.specializations || []).map((s: string, i: number) => (
                      <span key={i} className="badge" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
