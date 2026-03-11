'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getServices } from '@/lib/api'
import SacredLoader from '@/components/ui/SacredLoader'

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

  if (loading) return <SacredLoader message="Loading sacred ceremonies…" size="lg" />

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <span className="eyebrow block mb-3">Our Services</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--text-on-light)', marginBottom: '0.5rem' }}>
            Sacred Ceremonies &amp; Pujas
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-on-light2)', lineHeight: 1.7 }}>
            Choose a ceremony to find verified pandits near you
          </p>
        </div>

        {/* Services by category */}
        {categories.map(cat => (
          <div key={cat} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="eyebrow">{cat}</span>
              <div className="flex-1 divider-plain" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.filter((s: any) => s.category === cat).map((s: any) => (
                <div key={s.id}
                  onClick={() => router.push(`/search?service=${encodeURIComponent(s.name)}`)}
                  className="card-light group p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{ boxShadow: 'var(--shadow)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                      🕉️
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-on-light)', marginBottom: 2 }}>
                        {s.name}
                      </h3>
                      {s.nameHindi && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-on-light3)', marginBottom: 6 }}>{s.nameHindi}</p>
                      )}
                      {s.description && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-on-light2)', lineHeight: 1.55 }}>{s.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-right text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--accent)' }}>
                    Find Pandits →
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--text-on-light3)' }}>No services found</div>
        )}
      </div>
    </div>
  )
}
