'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPandit, getServices, createBooking } from '../../../lib/api'
import SacredLoader from '@/components/ui/SacredLoader'

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
        const [panditRes, servicesRes] = await Promise.all([getPandit(id as string), getServices()])
        setPandit(panditRes.data.pandit)
        setServices(servicesRes.data.services)
      } catch (err) { console.error('Failed to load pandit') }
      finally { setLoading(false) }
    }
    fetchData()
  }, [id])

  if (loading) return <SacredLoader message="Loading pandit profile…" size="lg" />
  if (!pandit) return (
    <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text-on-light2)' }}>
      Pandit not found
    </div>
  )

  const handleBook = () => {
    const token = localStorage.getItem('token')
    if (!token) { alert('Please login first to book a pandit'); router.push('/login'); return }
    router.push(`/book/${id}${preSelectedService ? `?service=${encodeURIComponent(preSelectedService)}` : ''}`)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Profile Header */}
        <div className="card-light p-6 mb-6" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--gold))' }}>
              🙏
            </div>
            <div className="flex-1">
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,1.9rem)', color: 'var(--text-on-light)', lineHeight: 1.2, marginBottom: 4 }}>
                Pt. {pandit.user?.firstName} {pandit.user?.lastName}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)', marginBottom: 8 }}>
                {pandit.city}, {pandit.state}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--gold)' }}>★ <strong style={{ color: 'var(--text-on-light)' }}>{pandit.rating || 'New'}</strong></span>
                <span style={{ color: 'var(--text-on-light3)' }}>({pandit.totalReviews} reviews)</span>
                <span style={{ color: 'var(--card-border)', padding: '0 4px' }}>·</span>
                <span style={{ color: 'var(--text-on-light2)' }}>{pandit.experienceYears} yrs exp</span>
              </div>
            </div>
            <div className="sm:text-right flex-shrink-0">
              <div className="price-serif mb-3" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.4rem)' }}>
                ₹{pandit.priceMin?.toLocaleString()} – ₹{pandit.priceMax?.toLocaleString()}
              </div>
              <button onClick={handleBook} className="btn-primary btn-shimmer w-full sm:w-auto">
                Book Now
              </button>
            </div>
          </div>

          {pandit.bio && (
            <p className="mt-5 pt-5" style={{ borderTop: '1px solid var(--card-border)', fontSize: '0.9rem', color: 'var(--text-on-light2)', lineHeight: 1.7 }}>
              {pandit.bio}
            </p>
          )}

          {(pandit.languages?.length > 0 || pandit.specializations?.length > 0) && (
            <div className="mt-5 flex flex-wrap gap-5">
              {pandit.languages?.length > 0 && (
                <div>
                  <span className="label-field">Languages: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {pandit.languages.map((lang: string) => (
                      <span key={lang} className="badge" style={{ background: 'var(--blue-s)', color: 'var(--blue)', border: '1px solid rgba(42,95,168,0.2)' }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {pandit.specializations?.length > 0 && (
                <div>
                  <span className="label-field">Specializations: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {pandit.specializations.map((spec: string) => (
                      <span key={spec} className="badge" style={{ background: 'var(--green-s)', color: 'var(--green)', border: '1px solid rgba(46,125,82,0.2)' }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {message && (
          <div className="p-4 rounded-lg mb-5" style={{ background: 'var(--green-s)', color: 'var(--green)', border: '1px solid rgba(46,125,82,0.2)' }}>
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 rounded-lg mb-5" style={{ background: 'var(--red-s)', color: 'var(--red)', border: '1px solid rgba(184,50,50,0.2)' }}>
            {error}
          </div>
        )}

        {/* Services Offered */}
        {pandit.services?.length > 0 && (
          <div className="card-light p-6 mb-6" style={{ boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-on-light)', marginBottom: 16 }}>
              Services Offered
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {pandit.services.map((ps: any) => (
                <div key={ps.id}
                  onClick={() => {
                    const token = localStorage.getItem('token')
                    if (!token) { alert('Please login first to book a pandit'); router.push('/login'); return }
                    router.push(`/book/${id}?service=${encodeURIComponent(ps.service?.name)}`)
                  }}
                  className="flex justify-between items-center p-4 cursor-pointer transition-all hover:-translate-y-0.5"
                  style={{ border: '1.5px solid var(--card-border)', borderRadius: 'var(--r-sm)', background: 'transparent' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-bg)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text-on-light)', fontSize: '0.9rem' }}>{ps.service?.name}</p>
                    {ps.duration && <p style={{ fontSize: '0.78rem', color: 'var(--text-on-light3)', marginTop: 2 }}>{ps.duration} mins</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="price-serif" style={{ fontSize: '1rem' }}>₹{ps.price}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>Book →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="card-light p-6" style={{ boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-on-light)', marginBottom: 16 }}>
            Reviews ({pandit.reviews?.length || 0})
          </h2>
          {!pandit.reviews?.length ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light3)' }}>No reviews yet</p>
          ) : (
            <div className="space-y-5">
              {pandit.reviews.map((review: any) => (
                <div key={review.id} className="pb-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span style={{ fontWeight: 600, color: 'var(--text-on-light)', fontSize: '0.9rem' }}>
                      {review.user?.firstName} {review.user?.lastName}
                    </span>
                    <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>{'★'.repeat(review.rating)}</span>
                  </div>
                  {review.comment && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)', lineHeight: 1.6 }}>{review.comment}</p>
                  )}
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-on-light3)', marginTop: 6 }}>
                    {new Date(review.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
