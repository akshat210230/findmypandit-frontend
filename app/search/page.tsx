'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { searchPandits } from '@/lib/api'

export default function SearchPandits() {
  const router = useRouter()
  const [pandits, setPandits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [service, setService] = useState('')

  const fetchPandits = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (city) params.city = city
      if (service) params.service = service
      const res = await searchPandits(params)
      setPandits(res.data.pandits || [])
    } catch (err) {
      console.error('Failed to load pandits')
    }
    setLoading(false)
  }

  useEffect(() => { fetchPandits() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPandits()
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Pandit</h1>
        <p className="text-gray-500 mb-8">Browse verified pandits in your city</p>

        {/* Search Filters */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">City</label>
            <select value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-orange-50 focus:outline-none focus:border-orange-400">
              <option value="">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Ceremony</label>
            <select value={service} onChange={e => setService(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-orange-50 focus:outline-none focus:border-orange-400">
              <option value="">All Ceremonies</option>
              <option value="Wedding Ceremony">Wedding Ceremony</option>
              <option value="Griha Pravesh">Griha Pravesh</option>
              <option value="Satyanarayan Katha">Satyanarayan Katha</option>
              <option value="Ganesh Puja">Ganesh Puja</option>
              <option value="Mundan Ceremony">Mundan Ceremony</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full sm:w-auto bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-700 transition">
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading pandits...</div>
        ) : pandits.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500">No pandits found. Try different filters.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{pandits.length} pandit{pandits.length > 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pandits.map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/pandit/${p.id}`)}
                  className="bg-white rounded-xl p-5 border border-orange-100 hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer flex gap-4"
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {p.user?.firstName?.[0]}{p.user?.lastName?.[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">Pt. {p.user?.firstName} {p.user?.lastName}</h3>
                      {p.verifiedAt && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{p.city} · {p.experienceYears} yrs exp</p>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(p.specializations || []).slice(0, 3).map((s: string, i: number) => (
                        <span key={i} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="font-bold text-gray-900">{p.rating > 0 ? p.rating.toFixed(1) : 'New'}</span>
                        <span className="text-yellow-500 ml-0.5">★</span>
                        <span className="text-gray-400 ml-1">({p.totalReviews})</span>
                      </div>
                      <div className="text-gray-300">|</div>
                      <div className="font-bold text-orange-600">₹{p.priceMin?.toLocaleString()} - ₹{p.priceMax?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}