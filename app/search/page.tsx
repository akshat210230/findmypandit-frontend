'use client'
import { useState, useEffect } from 'react'
import { searchPandits } from '../../lib/api'
import Link from 'next/link'

export default function SearchPage() {
  const [pandits, setPandits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ city: '', service: '', language: '' })

  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filters.city) params.city = filters.city
      if (filters.service) params.service = filters.service
      if (filters.language) params.language = filters.language

      const res = await searchPandits(params)
      setPandits(res.data.pandits)
    } catch (err) {
      console.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Find a Pandit 🔍</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="City (e.g. Mumbai)"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Service (e.g. Wedding)"
          value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Language (e.g. Hindi)"
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition"
        >
          Search
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">Searching...</p>
      ) : pandits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">😔</p>
          <p className="text-gray-500 text-lg">No pandits found. Try different filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pandits.map((pandit: any) => (
            <Link
              key={pandit.id}
              href={`/pandit/${pandit.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                  🙏
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    {pandit.user?.firstName} {pandit.user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{pandit.city}, {pandit.state}</p>
                </div>
              </div>

              {pandit.bio && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pandit.bio}</p>
              )}

              <div className="flex flex-wrap gap-1 mb-3">
                {pandit.languages?.map((lang: string) => (
                  <span key={lang} className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded">
                    {lang}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-medium">{pandit.rating || 'New'}</span>
                  <span className="text-gray-400 text-sm">({pandit.totalReviews} reviews)</span>
                </div>
                <p className="font-bold text-orange-600">
                  ₹{pandit.priceMin} - ₹{pandit.priceMax}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}