'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPandit, getServices, createBooking } from '../../../lib/api'

export default function PanditProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [preSelectedService, setPreSelectedService] = useState('')
  const [pandit, setPandit] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setPreSelectedService(params.get('service') || '')
  }, [])

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
            <p className="text-2xl font-bold text-orange-600 mb-3">₹{pandit.priceMin} - ₹{pandit.priceMax}</p>
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

        <div className="mt-4 flex flex-wrap gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Languages: </span>
            {pandit.languages?.map((lang: string) => (
              <span key={lang} className="bg-blue-50 text-blue-600 text-sm px-2 py-1 rounded mr-1">{lang}</span>
            ))}
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Specializations: </span>
            {pandit.specializations?.map((spec: string) => (
              <span key={spec} className="bg-green-50 text-green-600 text-sm px-2 py-1 rounded mr-1">{spec}</span>
            ))}
          </div>
        </div>
      </div>

      {message && <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 font-medium">{message}</div>}
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

      {/* Services Offered */}
      {pandit.services?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Services Offered</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {pandit.services.map((ps: any) => (
              <div key={ps.id}
                onClick={() => {
                  const token = localStorage.getItem('token')
                  if (!token) {
                    alert('Please login first to book a pandit')
                    router.push('/login')
                    return
                  }
                  router.push(`/book/${id}?service=${encodeURIComponent(ps.service?.name)}`)
                }}
                className="flex justify-between items-center border rounded-lg p-3 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
                <div>
                  <p className="font-medium text-gray-800">{ps.service?.name}</p>
                  {ps.duration && <p className="text-sm text-gray-500">{ps.duration} mins</p>}
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-orange-600">₹{ps.price}</p>
                  <span className="text-xs font-semibold text-orange-500">Book →</span>
                </div>
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
                  <span className="font-medium text-gray-800">{review.user?.firstName} {review.user?.lastName}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                </div>
                {review.comment && <p className="text-gray-600">{review.comment}</p>}
                <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}