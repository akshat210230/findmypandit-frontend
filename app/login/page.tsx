'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, googleLogin } from '@/lib/api'
import AarambhLogo from '@/components/AarambhLogo'

declare global {
  interface Window {
    google?: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleResponse = useCallback(async (response: any) => {
    setError('')
    setLoading(true)
    try {
      const res = await googleLogin({ credential: response.credential })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = res.data.user.role === 'PANDIT' ? '/pandit-dashboard' : '/dashboard'
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google login failed. Please try again.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Initialize Google Sign-In button
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleResponse,
        })
        window.google.accounts.id.renderButton(
          document.getElementById('google-login-btn'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'center',
          }
        )
      }
    }

    // Wait for Google script to load
    if (window.google?.accounts) {
      initGoogle()
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts) {
          initGoogle()
          clearInterval(timer)
        }
      }, 200)
      return () => clearInterval(timer)
    }
  }, [handleGoogleResponse])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
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
          <div className="flex justify-center mb-4"><AarambhLogo size={48} showText={false} /></div>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: '#2C1810' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: '#7A6350' }}>Login to your Aarambh account</p>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)', boxShadow: '0 4px 24px rgba(120,80,30,0.04)' }}>
          {error && <div className="p-3 rounded-xl text-sm mb-4" style={{ background: '#FEE8E8', color: '#C53030' }}>{error}</div>}

          {/* Google Sign-In Button */}
          <div className="mb-5">
            <div id="google-login-btn" className="flex justify-center" />
            {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <button disabled className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ border: '1.5px solid rgba(180,130,80,0.12)', color: '#7A6350', background: '#fff', opacity: 0.5 }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google (setup needed)
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(180,130,80,0.1)' }} />
            <span className="text-xs font-medium" style={{ color: '#B09980' }}>or login with email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(180,130,80,0.1)' }} />
          </div>

          {/* Email form */}
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