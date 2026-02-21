'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getServices } from '@/lib/api'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices()
        setServices(res.data.services || [])
      } catch (err) {
        console.error('Failed to load services')
      }
      setLoading(false)
    }
    fetchServices()
  }, [])

  const categories = [...new Set(services.map((s: any) => s.category))].filter(Boolean)

  const handleServiceClick = (service: any) => {
    // Navigate to search page with service pre-selected
    router.push(`/search?service=${encodeURIComponent(service.name)}`)
  }

  if (loading) return (
    <div className="min-h-screen pt-24 text-center" style={{ color: '#B09980' }}>Loading services...</div>
  )

  return (
    <div className="min-h-screen pt-20 pb-12 px-4" style={{ background: '#FFFAF5' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <span className="text-sm font-semibold tracking-[3px] uppercase mb-3 block" style={{ color: '#D4651E' }}>Our Services</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: '#2C1810' }}>Sacred Ceremonies & Pujas</h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: '#7A6350' }}>
            Choose a ceremony to find verified pandits near you
          </p>
        </div>

        {/* Services by category */}
        {categories.map(cat => (
          <div key={cat} className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 px-1" style={{ color: '#B09980' }}>{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.filter((s: any) => s.category === cat).map((s: any) => (
                <div key={s.id}
                  onClick={() => handleServiceClick(s)}
                  className="group p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)', boxShadow: '0 2px 12px rgba(120,80,30,0.03)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'rgba(212,101,30,0.06)' }}>
                      🕉️
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-0.5" style={{ color: '#2C1810' }}>{s.name}</h3>
                      {s.nameHindi && <p className="text-xs font-medium mb-2" style={{ color: '#B09980' }}>{s.nameHindi}</p>}
                      {s.description && <p className="text-sm leading-relaxed" style={{ color: '#7A6350' }}>{s.description}</p>}
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-right" style={{ color: '#D4651E' }}>
                    Find Pandits →
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-16" style={{ color: '#B09980' }}>No services found</div>
        )}
      </div>
    </div>
  )
}