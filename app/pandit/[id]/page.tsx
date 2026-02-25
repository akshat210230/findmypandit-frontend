'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPandit, createBooking, getServices } from '../../../lib/api'

export default function PanditProfilePage() {
const { id } = useParams()
const router = useRouter()
const [preSelectedService, setPreSelectedService] = useState('')

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  setPreSelectedService(params.get('service') || '')
}, [])
  const [pandit, setPandit] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    serviceId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    address: '',
    city: '',
    pincode: '',
    specialRequests: '',
    totalAmount: 0,
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [panditRes, servicesRes] = await Promise.all([
          getPandit(id as string),
          getServices(),
        ])
        setPandit(panditRes.data.pandit)
        setServices(servicesRes.data.services)
      } catch (err) {
        console.error('Failed to load pandit')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setBookingLoading(true)

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      await createBooking({
        panditId: pandit.id,
        ...bookingForm,
        totalAmount: Number(bookingForm.totalAmount),
      })
      setMessage('Booking created successfully! The pandit will confirm shortly.')
      setShowBooking(false)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <p className="text-center py-12 text-gray-500">Loading...</p>
  if (!pandit) return <p className="text-center py-12 text-gray-500">Pandit not found</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl">
            🙏
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {pandit.user?.firstName} {pandit.user?.lastName}
            </h1>
            <p className="text-gray-500">{pandit.city}, {pandit.state}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-500 text-lg">⭐</span>
              <span className="font-bold text-lg">{pandit.rating || 'New'}</span>
              <span className="text-gray-400">({pandit.totalReviews} reviews)</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-600">{pandit.experienceYears} years experience</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">₹{pandit.priceMin} - ₹{pandit.priceMax}</p>
<button
  className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition"
  onClick={() => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first to book a pandit')
      router.push('/login')
      return
    }
    router.push(`/book/${id}${preSelectedService ? `?service=${encodeURIComponent(preSelectedService)}` : ''}`)
  }}
>
  Book Now
</button>
          </div>
        </div>

        {pandit.bio && (
          <p className="mt-4 text-gray-600 border-t pt-4">{pandit.bio}</p>
        )}

        {/* Languages & Specializations */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Languages: </span>
            {pandit.languages?.map((lang: string) => (
              <span key={lang} className="bg-blue-50 text-blue-600 text-sm px-2 py-1 rounded mr-1">
                {lang}
              </span>
            ))}
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Specializations: </span>
            {pandit.specializations?.map((spec: string) => (
              <span key={spec} className="bg-green-50 text-green-600 text-sm px-2 py-1 rounded mr-1">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 font-medium">{message}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>
      )}

      {/* Booking Form */}
      {showBooking && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Book This Pandit</h2>
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ceremony Type</label>
              <select
                value={bookingForm.serviceId}
                onChange={(e) => setBookingForm({ ...bookingForm, serviceId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              >
                <option value="">Select a ceremony</option>
                {services.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.nameHindi ? `(${s.nameHindi})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookingForm.bookingDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={bookingForm.startTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                placeholder="Full address for the ceremony"
                value={bookingForm.address}
                onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={bookingForm.city}
                  onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Agreed amount"
                  value={bookingForm.totalAmount || ''}
                  onChange={(e) => setBookingForm({ ...bookingForm, totalAmount: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (optional)</label>
              <textarea
                placeholder="Any specific requirements for the ceremony..."
                value={bookingForm.specialRequests}
                onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-50"
            >
              {bookingLoading ? 'Creating Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      )}

      {/* Services Offered */}
      {pandit.services?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Services Offered</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {pandit.services.map((ps: any) => (
              <div key={ps.id} className="flex justify-between items-center border rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-800">{ps.service?.name}</p>
                  {ps.duration && <p className="text-sm text-gray-500">{ps.duration} mins</p>}
                </div>
                <p className="font-bold text-orange-600">₹{ps.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Reviews ({pandit.reviews?.length || 0})
        </h2>
        {pandit.reviews?.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {pandit.reviews?.map((review: any) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800">
                    {review.user?.firstName} {review.user?.lastName}
                  </span>
                  <span className="text-yellow-500">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                {review.comment && <p className="text-gray-600">{review.comment}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
