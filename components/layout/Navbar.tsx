'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    else setUser(null)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/search', label: 'Find Pandits' },
    ...(user ? [{ href: user.role === 'PANDIT' ? '/pandit-dashboard' : '/dashboard', label: 'Dashboard' }] : []),
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,250,245,0.92)' : 'rgba(255,250,245,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(180,130,80,0.1)' : 'rgba(180,130,80,0.06)'}`,
          boxShadow: scrolled ? '0 2px 16px rgba(120,80,30,0.04)' : 'none',
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                style={{ background: 'linear-gradient(135deg, #D4651E, #B8860B)', boxShadow: '0 2px 8px rgba(212,101,30,0.2)' }}>
                🙏
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ color: '#2C1810' }}>
                Find My Pandit
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive(link.href) ? '#D4651E' : '#7A6350',
                    background: isActive(link.href) ? 'rgba(212,101,30,0.06)' : 'transparent',
                  }}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm font-semibold" style={{ color: '#4A3728' }}>
                    Hi, {user.firstName}
                  </span>
                  <button onClick={handleLogout}
                    className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                    style={{ color: '#B09980', background: 'transparent' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"
                    className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                    style={{ color: '#7A6350' }}>
                    Login
                  </Link>
                  <Link href="/register"
                    className="text-sm font-semibold px-5 py-2 rounded-xl text-white transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)', boxShadow: '0 3px 12px rgba(212,101,30,0.15)' }}>
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition"
              style={{ color: '#2C1810' }}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(44,24,16,0.3)' }} onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-72 h-full shadow-2xl animate-slide-in" style={{ background: '#FFFAF5' }}>
            <div className="p-5">
              <button onClick={() => setMobileOpen(false)} className="float-right w-10 h-10 flex items-center justify-center rounded-lg text-xl" style={{ color: '#B09980' }}>
                ✕
              </button>
              <div className="clear-both pt-4">
                {user && (
                  <div className="mb-6 pb-4" style={{ borderBottom: '1px solid rgba(180,130,80,0.1)' }}>
                    <p className="font-bold" style={{ color: '#2C1810' }}>{user.firstName} {user.lastName}</p>
                    <p className="text-sm" style={{ color: '#B09980' }}>{user.email}</p>
                    <p className="text-xs font-semibold mt-1" style={{ color: '#D4651E' }}>
                      {user.role === 'PANDIT' ? '🙏 Pandit Account' : '👨‍👩‍👧 Family Account'}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-lg text-sm font-medium transition"
                      style={{
                        color: isActive(link.href) ? '#D4651E' : '#4A3728',
                        background: isActive(link.href) ? 'rgba(212,101,30,0.06)' : 'transparent',
                      }}>
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(180,130,80,0.1)' }}>
                  {user ? (
                    <button onClick={() => { handleLogout(); setMobileOpen(false) }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition"
                      style={{ color: '#C53030' }}>
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium" style={{ color: '#4A3728' }}>Login</Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-center text-white" style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)' }}>Get Started</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}