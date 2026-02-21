'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchPandits } from '@/lib/api'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedService = searchParams.get('service') || ''

  const [pandits, setPandits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [ceremony, setCeremony] = useState(preSelectedService)

  const cities = ['Indore', 'Mumbai', 'Delhi', 'Bangalore', 'Pune']

  useEffect(() => {
    fetchPandits()
  }, [])

  // Auto-search when coming from services page with pre-selected ceremony
  useEffect(() => {
    if (preSelectedService) {
      setCeremony(preSelectedService)
      fetchPandits()
    }
  }, [preSelectedService])

  const fetchPandits = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (city) params.city = city
      if (ceremony) params.service = ceremony
      const res = await searchPandits(params)
      setPandits(res.data.pandits || [])
    } catch (err) {
      console.error('Search failed')
    }
    setLoading(false)
  }

  const handleSearch = () => {
    fetchPandits()
  }

  const handlePanditClick = (panditId: string) => {
    // Pass ceremony info to pandit profile so booking can skip service selection
    if (ceremony) {
      router.push(`/pandit/${panditId}?service=${encodeURIComponent(ceremony)}`)
    } else {
      router.push(`/pandit/${panditId}`)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4" style={{ background: '#FFFAF5' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="pt-6 mb-8">
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: '#2C1810' }}>Find a Pandit</h1>
          <p className="text-sm" style={{ color: '#7A6350' }}>
            {preSelectedService
              ? `Showing pandits for "${preSelectedService}"`
              : 'Browse verified pandits in your city'}
          </p>
        </div>

        {/* Search Filters */}
        <div className="p-5 rounded-2xl mb-8 flex flex-col sm:flex-row gap-3 items-end"
          style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)', boxShadow: '0 2px 16px rgba(120,80,30,0.04)' }}>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: '#B09980' }}>City</label>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#FFF5EC', border: '1.5px solid rgba(180,130,80,0.1)', color: '#2C1810' }}>
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: '#B09980' }}>Ceremony</label>
            <input
              type="text"
              value={ceremony}
              onChange={e => setCeremony(e.target.value)}
              placeholder="All Ceremonies"
              className="w-full px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#FFF5EC', border: '1.5px solid rgba(180,130,80,0.1)', color: '#2C1810' }}
            />
          </div>
          <button onClick={handleSearch}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 w-full sm:w-auto"
            style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)', boxShadow: '0 3px 12px rgba(212,101,30,0.15)' }}>
            Search
          </button>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm mb-4 px-1" style={{ color: '#B09980' }}>
            {pandits.length} pandit{pandits.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-20" style={{ color: '#B09980' }}>Searching...</div>
        ) : pandits.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)' }}>
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#2C1810' }}>No pandits found</h3>
            <p className="text-sm" style={{ color: '#7A6350' }}>Try different filters or search in another city</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pandits.filter((p: any) => p.experienceYears > 0 || p.priceMin > 0).map((p: any) => (
              <div key={p.id}
                onClick={() => handlePanditClick(p.id)}
                className="group p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)', boxShadow: '0 2px 12px rgba(120,80,30,0.03)' }}>
                <div className="flex gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #D4651E, #B8860B)' }}>
                    {p.user?.firstName?.[0]}{p.user?.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold" style={{ color: '#2C1810' }}>Pt. {p.user?.firstName} {p.user?.lastName}</h3>
                    <p className="text-sm" style={{ color: '#7A6350' }}>{p.city} · {p.experienceYears} yrs exp</p>
                  </div>
                </div>

                {/* Specializations */}
                {p.specializations?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.specializations.slice(0, 3).map((s: string, i: number) => (
                      <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(212,101,30,0.06)', color: '#D4651E' }}>{s}</span>
                    ))}
                  </div>
                )}

                {/* Rating & Price */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(180,130,80,0.06)' }}>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span style={{ color: '#D4A017' }}>★</span>
                    <span className="font-bold" style={{ color: '#2C1810' }}>{p.rating > 0 ? p.rating.toFixed(1) : 'New'}</span>
                    <span style={{ color: '#B09980' }}>({p.totalReviews})</span>
                  </div>
                  <div className="font-bold text-sm" style={{ color: '#D4651E' }}>
                    ₹{p.priceMin?.toLocaleString()} - ₹{p.priceMax?.toLocaleString()}
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
    <Suspense fallback={<div className="min-h-screen pt-24 text-center" style={{ color: '#B09980' }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}