'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      // Force page refresh so navbar picks up the new user
      window.location.href = res.data.user.role === 'PANDIT' ? '/pandit-dashboard' : '/dashboard'
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16" style={{ background: '#FFFAF5' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, #D4651E, #B8860B)', boxShadow: '0 4px 16px rgba(212,101,30,0.15)' }}>
            🙏
          </div>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: '#2C1810' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: '#7A6350' }}>Login to your Find My Pandit account</p>
        </div>

        {/* Form */}
        <div className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)', boxShadow: '0 4px 24px rgba(120,80,30,0.04)' }}>
          {error && <div className="p-3 rounded-xl text-sm mb-4" style={{ background: '#FEE8E8', color: '#C53030' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#4A3728' }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com" required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#FFF5EC', border: '1.5px solid rgba(180,130,80,0.1)', color: '#2C1810' }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#4A3728' }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#FFF5EC', border: '1.5px solid rgba(180,130,80,0.1)', color: '#2C1810' }} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)', boxShadow: '0 4px 16px rgba(212,101,30,0.15)' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: '#7A6350' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold" style={{ color: '#D4651E' }}>Register here</Link>
        </p>
      </div>
    </div>
  )
}