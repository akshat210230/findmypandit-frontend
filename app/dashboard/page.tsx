'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getMyBookings } from '@/lib/api'

export default function Dashboard() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

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

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Welcome */}
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {user?.role === 'PANDIT' ? 'Pandit Dashboard' : 'My Bookings'}
        </h1>
        <p className="text-gray-500 mb-6">
          Welcome back, {user?.firstName || 'User'}!
          {user?.role === 'PANDIT' && (
            <button onClick={() => router.push('/pandit-dashboard')} className="ml-4 text-orange-600 font-semibold hover:underline text-sm">
              Go to Pandit Dashboard →
            </button>
          )}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
              tab === 'upcoming' ? 'bg-orange-600 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-orange-300'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
              tab === 'past' ? 'bg-orange-600 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-orange-300'
            }`}
          >
            Past ({past.length})
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading your bookings...</div>
        ) : displayed.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-orange-100">
            <div className="text-5xl mb-4">{tab === 'upcoming' ? '📅' : '📋'}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {tab === 'upcoming' ? "You haven't booked any ceremony yet." : 'Your completed bookings will appear here.'}
            </p>
            {tab === 'upcoming' && (
              <button onClick={() => router.push('/search')} className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
                Find a Pandit
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((b: any) => (
              <div key={b.id} className="bg-white rounded-xl p-5 border border-orange-100 hover:shadow-sm transition">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl flex-shrink-0">
                    🙏
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{b.service?.name || b.ceremony?.name || 'Ceremony'}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {b.pandit?.user?.firstName ? `Pt. ${b.pandit.user.firstName} ${b.pandit.user.lastName}` : 'Pandit'} · {b.city || 'Indore'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      {b.startTime && ` · ⏰ ${b.startTime}`}
                      {b.choghadiya && ` · 🕉️ ${b.choghadiya}`}
                    </p>
                  </div>

                  {/* Price & Actions */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-orange-600 mb-1">₹{b.totalAmount?.toLocaleString()}</div>
                    {tab === 'past' && b.status === 'COMPLETED' && (
                      <button
                        onClick={() => router.push(`/review/${b.id}`)}
                        className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold hover:bg-orange-100 transition"
                      >
                        Leave Review
                      </button>
                    )}
                    {tab === 'upcoming' && b.status === 'PENDING' && (
                      <span className="text-xs text-yellow-600">Awaiting pandit confirmation</span>
                    )}
                  </div>
                </div>

                {/* Address */}
                {b.address && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-400">
                    📍 {b.address}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}