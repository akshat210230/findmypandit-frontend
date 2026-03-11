'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AarambhLogo from '../AarambhLogo'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    const h = () => {}
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
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/search', label: 'Find Pandits' },
    ...(user ? [{ href: user.role === 'PANDIT' ? '/pandit-dashboard' : '/dashboard', label: 'Dashboard' }] : []),
  ]

  const isActive = (href: string) => pathname === href

  const navBg = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'g\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.72\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23g)\' opacity=\'0.04\'/%3E%3C/svg%3E")'

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'var(--nav)',
          backgroundImage: navBg,
          backgroundSize: '200px 200px',
          borderBottom: '1px solid rgba(255,240,200,0.08)',
          boxShadow: '0 2px 20px rgba(44,26,8,0.2)',
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/"><AarambhLogo size={36} showText={true} /></Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive(link.href) ? 'var(--gold)' : 'var(--text-on-dark2)',
                    background: isActive(link.href) ? 'rgba(224,160,32,0.12)' : 'transparent',
                  }}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-on-dark2)' }}>
                    Hi, {user.firstName}
                  </span>
                  <button onClick={handleLogout}
                    className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                    style={{ color: 'var(--text-on-dark3)' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"
                    className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                    style={{ color: 'var(--text-on-dark2)' }}>
                    Login
                  </Link>
                  <Link href="/register"
                    className="text-sm font-semibold px-5 py-2 rounded-full text-white transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'var(--accent)',
                      boxShadow: '0 3px 12px rgba(200,72,0,0.3)',
                    }}>
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg"
              style={{ color: 'var(--text-on-dark)', background: 'rgba(255,240,200,0.08)' }}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(44,26,8,0.45)' }}
            onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full shadow-2xl animate-slide-in"
            style={{
              backgroundColor: 'var(--nav)',
              backgroundImage: navBg,
              backgroundSize: '200px 200px',
              width: 'min(288px, 85vw)',
              borderLeft: '1px solid rgba(255,240,200,0.08)',
            }}>
            <div className="p-5">
              <button onClick={() => setMobileOpen(false)}
                className="float-right w-10 h-10 flex items-center justify-center rounded-lg text-xl"
                style={{ color: 'var(--text-on-dark3)', background: 'rgba(255,240,200,0.06)' }}>✕</button>
              <div className="clear-both pt-4">
                {user && (
                  <div className="mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,240,200,0.08)' }}>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-on-dark)' }}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark3)' }}>{user.email}</p>
                    <p className="text-xs font-semibold mt-2" style={{ color: 'var(--gold)' }}>
                      {user.role === 'PANDIT' ? '🙏 Pandit Account' : '👨‍👩‍👧 Family Account'}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-lg text-sm font-medium"
                      style={{
                        color: isActive(link.href) ? 'var(--gold)' : 'var(--text-on-dark2)',
                        background: isActive(link.href) ? 'rgba(224,160,32,0.1)' : 'transparent',
                      }}>
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,240,200,0.08)' }}>
                  {user ? (
                    <button onClick={() => { handleLogout(); setMobileOpen(false) }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium"
                      style={{ color: 'rgba(220,100,100,0.9)' }}>
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 rounded-lg text-sm font-medium"
                        style={{ color: 'var(--text-on-dark2)' }}>
                        Login
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 rounded-full text-sm font-semibold text-center"
                        style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 3px 12px rgba(200,72,0,0.3)' }}>
                        Get Started
                      </Link>
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
