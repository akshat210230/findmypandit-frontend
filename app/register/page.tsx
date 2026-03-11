'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register, googleLogin } from '@/lib/api'
import AarambhLogo from '@/components/AarambhLogo'
import ShlokGreeting from '@/components/ui/ShlokGreeting'

declare global {
  interface Window { google?: any }
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'FAMILY' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shlok, setShlok] = useState<{ show: boolean; role: string; redirect: string }>({
    show: false, role: '', redirect: '',
  })

  const handleGoogleResponse = useCallback(async (response: any) => {
    setError(''); setLoading(true)
    try {
      const res = await googleLogin({ credential: response.credential })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setShlok({ show: true, role: res.data.user.role ?? 'FAMILY', redirect: '/dashboard' })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google sign up failed. Please try again.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleResponse,
        })
        window.google.accounts.id.renderButton(
          document.getElementById('google-register-btn'),
          { theme: 'outline', size: 'large', width: '100%', text: 'signup_with', shape: 'rectangular', logo_alignment: 'center' }
        )
      }
    }
    if (window.google?.accounts) { initGoogle() } else {
      const timer = setInterval(() => { if (window.google?.accounts) { initGoogle(); clearInterval(timer) } }, 200)
      return () => clearInterval(timer)
    }
  }, [handleGoogleResponse])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await register(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      const redirect = form.role === 'PANDIT' ? '/pandit-dashboard' : '/dashboard'
      setShlok({ show: true, role: form.role, redirect })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.')
    }
    setLoading(false)
  }

  const update = (key: string, val: string) => setForm({ ...form, [key]: val })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      {shlok.show && (
        <ShlokGreeting role={shlok.role} redirectPath={shlok.redirect}
          onComplete={() => { window.location.href = shlok.redirect }} />
      )}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><AarambhLogo size={48} showText={false} /></div>
          <h1 className="text-2xl mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: 'var(--text-on-light)' }}>
            Create your account
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-on-light2)' }}>Join Aarambh — जहाँ श्रद्धा मिले सेवा से</p>
        </div>

        <div className="card-light p-6" style={{ boxShadow: 'var(--shadow)' }}>
          {error && (
            <div className="p-3 rounded-lg text-sm mb-4" style={{ background: 'var(--red-s)', color: 'var(--red)', border: '1px solid rgba(184,50,50,0.2)' }}>
              {error}
            </div>
          )}

          {/* Google Sign-Up */}
          <div className="mb-5">
            <div id="google-register-btn" className="flex justify-center" />
            {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <button disabled className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium"
                style={{ border: '1.5px solid var(--card-border)', color: 'var(--text-on-light3)', background: 'var(--input-bg)', borderRadius: 'var(--r-sm)', opacity: 0.5 }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google (setup needed)
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 divider-plain" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-on-light3)' }}>or register with email</span>
            <div className="flex-1 divider-plain" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Role selector */}
            <div>
              <label className="label-field block mb-1.5">I am a</label>
              <div className="flex gap-2">
                {[{ v: 'FAMILY', l: '👨‍👩‍👧 Family', d: 'Book pandits' }, { v: 'PANDIT', l: '🙏 Pandit', d: 'Offer services' }].map(r => (
                  <label key={r.v} className="flex-1 p-3 cursor-pointer text-center transition-all"
                    style={{
                      border: `2px solid ${form.role === r.v ? 'var(--accent)' : 'var(--card-border)'}`,
                      background: form.role === r.v ? 'var(--accent-bg)' : 'transparent',
                      borderRadius: 'var(--r-sm)',
                    }}>
                    <input type="radio" name="role" value={r.v} checked={form.role === r.v}
                      onChange={() => update('role', r.v)} className="sr-only" />
                    <div className="text-sm font-bold" style={{ color: form.role === r.v ? 'var(--accent)' : 'var(--text-on-light)' }}>{r.l}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-on-light3)' }}>{r.d}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field block mb-1.5">First Name</label>
                <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)}
                  required className="w-full" style={{ padding: '11px 16px' }} />
              </div>
              <div>
                <label className="label-field block mb-1.5">Last Name</label>
                <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)}
                  required className="w-full" style={{ padding: '11px 16px' }} />
              </div>
            </div>

            <div>
              <label className="label-field block mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                placeholder="your@email.com" required className="w-full" style={{ padding: '11px 16px' }} />
            </div>

            <div>
              <label className="label-field block mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                placeholder="+91 98765 43210" className="w-full" style={{ padding: '11px 16px' }} />
            </div>

            <div>
              <label className="label-field block mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                placeholder="Min 6 characters" required minLength={6} className="w-full" style={{ padding: '11px 16px' }} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-shimmer w-full">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-on-light2)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--accent)' }}>Login here</Link>
        </p>
      </div>
    </div>
  )
}
