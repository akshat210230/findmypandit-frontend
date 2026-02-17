'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getMyBookings, updateBookingStatus, updatePanditProfile } from '@/lib/api'
import api from '@/lib/api'

export default function PanditDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [pandit, setPandit] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'bookings' | 'profile'>('bookings')
  const [actionLoading, setActionLoading] = useState('')
  const [message, setMessage] = useState('')

  // Profile edit state
  const [editMode, setEditMode] = useState(false)
  const [profileForm, setProfileForm] = useState({
    bio: '',
    experienceYears: 0,
    city: '',
    state: '',
    priceMin: 0,
    priceMax: 0,
    languages: '',
    specializations: '',
    isAvailable: true,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (!token || !stored) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(stored)
    if (userData.role !== 'PANDIT') {
      router.push('/dashboard')
      return
    }
    setUser(userData)
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      // Get pandit profile
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

      // Get bookings
      const bookingsRes = await getMyBookings()
      setBookings(bookingsRes.data.bookings || bookingsRes.data || [])
    } catch (err) {
      console.error('Failed to load pandit data')
    }
    setLoading(false)
  }

  const handleBookingAction = async (bookingId: string, status: string) => {
    setActionLoading(bookingId)
    setMessage('')
    try {
      await updateBookingStatus(bookingId, { status })
      setMessage(`Booking ${status.toLowerCase()} successfully!`)
      fetchData()
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Action failed')
    }
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
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to update profile')
    }
  }

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  if (loading) return <div className="min-h-screen bg-orange-50 pt-24 text-center text-gray-400">Loading...</div>

  const pending = bookings.filter(b => b.status === 'PENDING')
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED')
  const others = bookings.filter(b => b.status !== 'PENDING' && b.status !== 'CONFIRMED')

  return (
    <div className="min-h-screen bg-orange-50 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-900 mb-1">Pandit Dashboard</h1>
        <p className="text-gray-500 mb-6">Welcome, Pt. {user?.firstName} {user?.lastName}</p>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-orange-100 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pending.length}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-100 text-center">
            <div className="text-2xl font-bold text-green-600">{confirmed.length}</div>
            <div className="text-xs text-gray-500">Confirmed</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-100 text-center">
            <div className="text-2xl font-bold text-orange-600">{pandit?.rating > 0 ? pandit.rating.toFixed(1) : '-'}</div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-100 text-center">
            <div className="text-2xl font-bold text-blue-600">{pandit?.totalReviews || 0}</div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('bookings')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
              tab === 'bookings' ? 'bg-orange-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setTab('profile')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
              tab === 'profile' ? 'bg-orange-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            My Profile
          </button>
        </div>

        {/* ─── BOOKINGS TAB ─── */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {/* Pending bookings first */}
            {pending.length > 0 && (
              <div className="mb-2">
                <h3 className="text-sm font-bold text-yellow-700 uppercase tracking-wide mb-3">⏳ Pending — Action Required</h3>
                {pending.map((b: any) => (
                  <div key={b.id} className="bg-white rounded-xl p-5 border-2 border-yellow-200 mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{b.service?.name || b.ceremony?.name || 'Ceremony'}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          👤 {b.user?.firstName} {b.user?.lastName} · 📍 {b.address}, {b.city}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          {b.startTime && ` · ⏰ ${b.startTime}`}
                          {b.choghadiya && ` · 🕉️ ${b.choghadiya}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBookingAction(b.id, 'CONFIRMED')}
                          disabled={actionLoading === b.id}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {actionLoading === b.id ? '...' : '✓ Accept'}
                        </button>
                        <button
                          onClick={() => handleBookingAction(b.id, 'CANCELLED')}
                          disabled={actionLoading === b.id}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition disabled:opacity-50"
                        >
                          ✗ Decline
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="text-lg font-bold text-orange-600">₹{b.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Confirmed bookings */}
            {confirmed.length > 0 && (
              <div className="mb-2">
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3">✅ Confirmed</h3>
                {confirmed.map((b: any) => (
                  <div key={b.id} className="bg-white rounded-xl p-5 border border-green-200 mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{b.service?.name || b.ceremony?.name || 'Ceremony'}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          👤 {b.user?.firstName} {b.user?.lastName} · 📍 {b.address}, {b.city}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          {b.startTime && ` · ⏰ ${b.startTime}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-orange-600">₹{b.totalAmount?.toLocaleString()}</span>
                        <div className="mt-1">
                          <button
                            onClick={() => handleBookingAction(b.id, 'COMPLETED')}
                            disabled={actionLoading === b.id}
                            className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold hover:bg-blue-200 transition"
                          >
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Other bookings */}
            {others.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Past Bookings</h3>
                {others.map((b: any) => (
                  <div key={b.id} className="bg-white rounded-xl p-5 border border-gray-100 mb-3 opacity-70">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-700">{b.service?.name || b.ceremony?.name || 'Ceremony'}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                      <span className="font-bold text-gray-600">₹{b.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bookings.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center border border-orange-100">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 text-sm">When families book you, their requests will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── PROFILE TAB ─── */}
        {tab === 'profile' && (
          <div className="bg-white rounded-xl p-6 border border-orange-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-200 transition">
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditMode(false)} className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-500">
                    Cancel
                  </button>
                  <button onClick={handleProfileSave} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition">
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                  <textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                    <input value={profileForm.state} onChange={e => setProfileForm({...profileForm, state: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (years)</label>
                  <input type="number" value={profileForm.experienceYears} onChange={e => setProfileForm({...profileForm, experienceYears: parseInt(e.target.value) || 0})} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Min Price (₹)</label>
                    <input type="number" value={profileForm.priceMin} onChange={e => setProfileForm({...profileForm, priceMin: parseInt(e.target.value) || 0})} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Max Price (₹)</label>
                    <input type="number" value={profileForm.priceMax} onChange={e => setProfileForm({...profileForm, priceMax: parseInt(e.target.value) || 0})} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Languages (comma separated)</label>
                  <input value={profileForm.languages} onChange={e => setProfileForm({...profileForm, languages: e.target.value})} placeholder="Hindi, Sanskrit, English" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Specializations (comma separated)</label>
                  <input value={profileForm.specializations} onChange={e => setProfileForm({...profileForm, specializations: e.target.value})} placeholder="Weddings, Griha Pravesh, Ganesh Puja" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700">Available for bookings</label>
                  <button
                    onClick={() => setProfileForm({...profileForm, isAvailable: !profileForm.isAvailable})}
                    className={`w-12 h-6 rounded-full transition ${profileForm.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${profileForm.isAvailable ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Bio</div>
                  <p className="text-gray-700">{pandit?.bio || 'No bio added'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Location</div>
                    <p className="text-gray-700 font-semibold">{pandit?.city}, {pandit?.state}</p>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Experience</div>
                    <p className="text-gray-700 font-semibold">{pandit?.experienceYears} years</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Price Range</div>
                    <p className="text-orange-600 font-bold">₹{pandit?.priceMin?.toLocaleString()} - ₹{pandit?.priceMax?.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</div>
                    <span className={`text-sm font-semibold ${pandit?.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {pandit?.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Languages</div>
                  <div className="flex flex-wrap gap-2">
                    {(pandit?.languages || []).map((l: string, i: number) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{l}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Specializations</div>
                  <div className="flex flex-wrap gap-2">
                    {(pandit?.specializations || []).map((s: string, i: number) => (
                      <span key={i} className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">{s}</span>
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