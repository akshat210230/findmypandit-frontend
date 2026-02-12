'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPanditProfile, searchPandits } from '../../../lib/api'
import api from '../../../lib/api'

export default function PanditProfileEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [hasProfile, setHasProfile] = useState(false)
  const [form, setForm] = useState({
    bio: '',
    experienceYears: 0,
    languages: '',
    specializations: '',
    priceMin: 0,
    priceMax: 0,
    city: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }
    const parsed = JSON.parse(user)
    if (parsed.role !== 'PANDIT') {
      router.push('/dashboard')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const data = {
        ...form,
        languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
        specializations: form.specializations.split(',').map((s) => s.trim()).filter(Boolean),
      }

      if (hasProfile) {
        await api.put('/pandits/profile', data)
        setMessage('Profile updated successfully!')
      } else {
        await createPanditProfile(data)
        setHasProfile(true)
        setMessage('Profile created successfully!')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {hasProfile ? 'Edit' : 'Create'} Your Pandit Profile 📝
      </h1>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6">{message}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            placeholder="Tell families about yourself and your experience..."
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              placeholder="e.g. Maharashtra"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
          <input
            type="number"
            value={form.experienceYears}
            onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Languages (comma separated)
          </label>
          <input
            type="text"
            placeholder="Hindi, Sanskrit, English"
            value={form.languages}
            onChange={(e) => setForm({ ...form, languages: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specializations (comma separated)
          </label>
          <input
            type="text"
            placeholder="Weddings, Griha Pravesh, Satyanarayan Katha"
            value={form.specializations}
            onChange={(e) => setForm({ ...form, specializations: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
            <input
              type="number"
              value={form.priceMin}
              onChange={(e) => setForm({ ...form, priceMin: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
            <input
              type="number"
              value={form.priceMax}
              onChange={(e) => setForm({ ...form, priceMax: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : hasProfile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  )
}
