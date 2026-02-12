'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMyBookings } from '../../lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(stored))
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings()
      setBookings(res.data.bookings)
    } catch (err) {
      console.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user.firstName}! 🙏
        </h1>
        <p className="text-gray-500 mt-1">
          Role: <span className="font-medium text-orange-600">{user.role}</span>
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {user.role === 'FAMILY' && (
          <button
            onClick={() => router.push('/search')}
            className="bg-orange-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition"
          >
            🔍 Find a Pandit
          </button>
        )}
        {user.role === 'PANDIT' && (
          <button
            onClick={() => router.push('/pandit/profile')}
            className="bg-orange-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition"
          >
            📝 Edit My Profile
          </button>
        )}
        <button
          onClick={() => router.push('/services')}
          className="bg-white border-2 border-orange-600 text-orange-600 p-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition"
        >
          📋 View Services
        </button>
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Bookings</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No bookings yet</p>
            {user.role === 'FAMILY' && (
              <button
                onClick={() => router.push('/search')}
                className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Find a Pandit
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">{booking.service?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.bookingDate).toLocaleDateString()} at {booking.startTime}
                  </p>
                  <p className="text-sm text-gray-500">{booking.city}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : booking.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                  <p className="mt-1 font-bold text-orange-600">₹{booking.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}