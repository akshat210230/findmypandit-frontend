'use client'
import { useState, useEffect } from 'react'
import { getServices } from '../../lib/api'
import Link from 'next/link'

const emojiMap: Record<string, string> = {
  'Wedding Ceremony': '💍',
  'Griha Pravesh': '🏠',
  'Satyanarayan Katha': '🙏',
  'Mundan Ceremony': '👶',
  'Namkaran': '👣',
  'Engagement Ceremony': '💑',
  'Ganesh Puja': '🐘',
  'Lakshmi Puja': '✨',
  'Rudrabhishek': '🔱',
  'Navgraha Shanti': '🪐',
  'Akhand Ramayan Path': '📖',
  'Vastu Shanti': '🏗️',
  'Last Rites (Antim Sanskar)': '🕯️',
  'Sunderkand Path': '📿',
  'Diwali Puja': '🪔',
}

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getServices()
        setServices(res.data.services)
      } catch (err) {
        console.error('Failed to load services')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const categories = [...new Set(services.map((s) => s.category))]

  if (loading) return <p className="text-center py-12 text-gray-500">Loading services...</p>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Our Services 📋</h1>
      <p className="text-gray-500 mb-8">Browse all ceremonies and find a pandit</p>

      {categories.map((category) => (
        <div key={category} className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">{category}</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services
              .filter((s) => s.category === category)
              .map((service) => (
                <Link
                  key={service.id}
                  href={`/search?service=${encodeURIComponent(service.name)}`}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="text-3xl mb-2">{emojiMap[service.name] || '🙏'}</div>
                  <h3 className="font-bold text-gray-800">{service.name}</h3>
                  {service.nameHindi && (
                    <p className="text-sm text-orange-600">{service.nameHindi}</p>
                  )}
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                  )}
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
