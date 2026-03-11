'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchPandits } from '@/lib/api'
import SacredLoader from '@/components/ui/SacredLoader'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedService = searchParams.get('service') || ''

  const [pandits, setPandits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [ceremony, setCeremony] = useState(preSelectedService)

  const cities = ['Indore', 'Mumbai', 'Delhi', 'Bangalore', 'Pune']

  const ceremonies = [
    'Vivah Puja (Wedding)',
    'Satyanarayan Katha',
    'Griha Pravesh (Housewarming)',
    'Namkaran (Naming Ceremony)',
    'Mundan (First Haircut)',
    'Janeu / Upanayana',
    'Ganesh Puja',
    'Navratri / Durga Puja',
    'Shradh / Pitru Paksha',
    'Vastu Shanti',
    'Kuan Puja (Well Ceremony)',
    'Bhoomi Puja (Land Blessing)',
    'Rudrabhishek',
    'Lakshmi Puja',
    'Annaprashan (First Rice)',
  ]

  useEffect(() => { fetchPandits() }, [])

  useEffect(() => {
    if (preSelectedService) { setCeremony(preSelectedService); fetchPandits() }
  }, [preSelectedService])

  const fetchPandits = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (city) params.city = city
      if (ceremony) params.service = ceremony
      const res = await searchPandits(params)
      setPandits(res.data.pandits || [])
    } catch (err) { console.error('Search failed') }
    setLoading(false)
  }

  const handlePanditClick = (panditId: string) => {
    router.push(ceremony ? `/pandit/${panditId}?service=${encodeURIComponent(ceremony)}` : `/pandit/${panditId}`)
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="pt-6 mb-8">
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: 'var(--text-on-light)', marginBottom: 4 }}>
            Find a Pandit
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)' }}>
            {preSelectedService ? `Showing pandits for "${preSelectedService}"` : 'Browse verified pandits in your city'}
          </p>
        </div>

        {/* Filters */}
        <div className="card-light p-5 mb-8 flex flex-col sm:flex-row gap-3 items-end"
          style={{ boxShadow: 'var(--shadow)' }}>
          <div className="flex-1 w-full">
            <label className="label-field block mb-1.5">City</label>
            <select value={city} onChange={e => setCity(e.target.value)} className="w-full">
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="label-field block mb-1.5">Ceremony</label>
            <select value={ceremony} onChange={e => setCeremony(e.target.value)} className="w-full">
              <option value="">All Ceremonies</option>
              {ceremonies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={fetchPandits} className="btn-primary btn-shimmer w-full sm:w-auto" style={{ whiteSpace: 'nowrap' }}>
            Search
          </button>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm mb-4 px-1" style={{ color: 'var(--text-on-light3)' }}>
            {pandits.length} pandit{pandits.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Results */}
        {loading ? (
          <SacredLoader message="Searching for pandits…" size="md" />
        ) : pandits.length === 0 ? (
          <div className="card-light text-center py-16" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="text-4xl mb-3">🔍</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-on-light)', marginBottom: 8 }}>
              No pandits found
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)' }}>Try different filters or search in another city</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pandits.filter((p: any) => p.experienceYears > 0 || p.priceMin > 0).map((p: any) => (
              <div key={p.id}
                onClick={() => handlePanditClick(p.id)}
                className="card-light group cursor-pointer transition-all duration-300 hover:-translate-y-1 p-5"
                style={{ boxShadow: 'var(--shadow)' }}>
                <div className="flex gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--gold))' }}>
                    {p.user?.firstName?.[0]}{p.user?.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-on-light)' }}>
                      Pt. {p.user?.firstName} {p.user?.lastName}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-on-light2)' }}>{p.city} · {p.experienceYears} yrs exp</p>
                  </div>
                </div>

                {p.specializations?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.specializations.slice(0, 3).map((s: string, i: number) => (
                      <span key={i} className="badge"
                        style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 divider-plain" style={{ paddingTop: 12, marginTop: 4, borderTop: '1px solid var(--card-border)' }}>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span style={{ color: 'var(--gold)' }}>★</span>
                    <span className="font-bold" style={{ color: 'var(--text-on-light)' }}>{p.rating > 0 ? p.rating.toFixed(1) : 'New'}</span>
                    <span style={{ color: 'var(--text-on-light3)' }}>({p.totalReviews})</span>
                  </div>
                  <div className="price-serif" style={{ fontSize: '1rem' }}>
                    ₹{p.priceMin?.toLocaleString()} – ₹{p.priceMax?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SacredLoader message="Loading…" size="lg" />}>
      <SearchContent />
    </Suspense>
  )
}
