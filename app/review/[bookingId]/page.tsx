'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createReview } from '@/lib/api'
import api from '@/lib/api'

export default function ReviewPage() {
  const { bookingId } = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`)
        setBooking(res.data.booking || res.data)
      } catch (err) {
        console.error('Failed to load booking')
      }
      setLoading(false)
    }
    if (bookingId) fetchBooking()
  }, [bookingId, router])

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await createReview({
        bookingId,
        panditId: booking?.panditId || booking?.pandit?.id,
        rating,
        comment: comment || undefined,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit review')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen bg-orange-50 pt-24 text-center text-gray-400">Loading...</div>

  if (success) {
    return (
      <div className="min-h-screen bg-orange-50 pt-20 pb-12 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-xl p-8 border border-orange-100 text-center mt-8">
          <div className="text-5xl mb-4">🙏</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-500 mb-2">Your review has been submitted successfully.</p>
          <p className="text-gray-400 text-sm mb-6">Your feedback helps other families find the right pandit.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/dashboard')} className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
              Back to Dashboard
            </button>
            <button onClick={() => router.push('/search')} className="border-2 border-gray-200 px-6 py-3 rounded-lg font-semibold text-gray-600 hover:border-orange-300 transition">
              Book Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const panditName = booking?.pandit?.user
    ? `Pt. ${booking.pandit.user.firstName} ${booking.pandit.user.lastName}`
    : 'Pandit'

  return (
    <div className="min-h-screen bg-orange-50 pt-20 pb-12 px-4">
      <div className="max-w-lg mx-auto">

        <button onClick={() => router.back()} className="text-sm text-orange-600 font-semibold mb-6 hover:underline">
          ← Back
        </button>

        <div className="bg-white rounded-xl p-6 border border-orange-100">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Leave a Review</h2>
          <p className="text-sm text-gray-500 mb-6">How was your experience with {panditName}?</p>

          {/* Booking summary */}
          {booking && (
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                  {booking?.pandit?.user?.firstName?.[0]}{booking?.pandit?.user?.lastName?.[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{panditName}</div>
                  <div className="text-xs text-gray-500">
                    {booking.service?.name || booking.ceremony?.name || 'Ceremony'} · {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}

          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  {star <= (hoverRating || rating) ? '★' : '☆'}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Below Average'}
              {rating === 3 && 'Average'}
              {rating === 4 && 'Good'}
              {rating === 5 && 'Excellent'}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Review (optional)</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell others about your experience — was the pandit punctual, knowledgeable, and helpful?"
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}