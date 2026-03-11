'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const PAPER_NAV = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E\")"

function DiyaIcon({ size = 36 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, flexShrink: 0 }}>
      <ellipse cx="24" cy="38" rx="14" ry="5" fill="#D4651E" opacity="0.18"/>
      <path d="M24 18 C20 24 14 30 10 34 C16 36 20 34 24 30 C28 34 32 36 38 34 C34 30 28 24 24 18Z" fill="#D4651E" opacity="0.2"/>
      <path d="M24 8 C22 12 19 16 19 20 C19 23 21 26 24 26 C27 26 29 23 29 20 C29 16 26 12 24 8Z" fill="url(#ng)"/>
      <path d="M24 12 C23 14 21.5 17 21.5 19.5 C21.5 21.5 22.5 23 24 23 C25.5 23 26.5 21.5 26.5 19.5 C26.5 17 25 14 24 12Z" fill="#FFC857" opacity="0.85"/>
      <ellipse cx="24" cy="26" rx="5.5" ry="2" fill="#D4651E"/>
      <ellipse cx="24" cy="26" rx="4" ry="1.2" fill="#E88030"/>
      <defs>
        <linearGradient id="ng" x1="24" y1="8" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8C00"/>
          <stop offset="40%" stopColor="#E8732A"/>
          <stop offset="100%" stopColor="#D4651E"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.hasAttribute('data-nav-dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-nav-dark'] })
    setIsDark(document.documentElement.hasAttribute('data-nav-dark'))
    return () => observer.disconnect()
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

  const navStyle: React.CSSProperties = isDark ? {
    backgroundColor: 'rgba(10,5,2,0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(255,240,200,0.06)',
    boxShadow: 'none',
    transition: 'all 0.4s ease',
  } : {
    backgroundColor: '#5C2A00',
    backgroundImage: PAPER_NAV,
    backgroundSize: '200px 200px',
    backdropFilter: 'none',
    borderBottom: '1px solid rgba(255,240,200,0.08)',
    boxShadow: '0 2px 24px rgba(0,0,0,0.2)',
    isolation: 'isolate',
    transition: 'all 0.4s ease',
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        display: 'flex', alignItems: 'center',
        padding: '0 40px',
        ...navStyle,
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>

          {/* Brand */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <DiyaIcon size={32} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '1.28rem', color: '#FFF0C8', letterSpacing: '-0.2px' }}>
                Aarambh
              </span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.56rem', color: 'rgba(255,240,200,0.55)', letterSpacing: '0.08em', display: 'block', marginTop: 2 }}>
                जहाँ श्रद्धा मिले सेवा से
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.83rem',
                color: isActive(link.href) ? '#E0A020' : 'rgba(255,240,200,0.65)',
                background: isActive(link.href) ? 'rgba(224,160,32,0.1)' : 'transparent',
                border: isActive(link.href) ? '1px solid rgba(224,160,32,0.2)' : '1px solid transparent',
                borderRadius: 999,
                padding: '6px 14px',
                textDecoration: 'none',
                transition: 'all 0.18s ease',
                display: 'inline-block',
              }}
              onMouseEnter={e => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.background = 'rgba(255,240,200,0.07)' }}
              onMouseLeave={e => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden md:flex">
            {user ? (
              <>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.83rem', color: 'rgba(255,240,200,0.65)' }}>
                  Hi, <span style={{ color: '#E0A020', fontWeight: 600 }}>{user.firstName}</span>
                </span>
                <button onClick={handleLogout} style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.83rem',
                  color: 'rgba(255,240,200,0.65)',
                  background: 'transparent',
                  border: '1px solid rgba(255,240,200,0.15)',
                  borderRadius: 999,
                  padding: '5px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.83rem',
                  color: 'rgba(255,240,200,0.65)',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: '1px solid transparent',
                  transition: 'all 0.18s ease',
                }}>
                  Login
                </Link>
                <Link href="/register" style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: '#C84800',
                  borderRadius: 999,
                  padding: '7px 18px',
                  textDecoration: 'none',
                  boxShadow: '0 3px 12px rgba(200,72,0,0.3)',
                  transition: 'all 0.18s ease',
                }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{
              width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8,
              background: 'rgba(255,240,200,0.08)',
              border: 'none',
              color: '#FFF0C8',
              fontSize: '1.1rem',
              cursor: 'pointer',
            }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>

        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} className="md:hidden">
          <div
            style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(4px)', background: 'rgba(44,26,8,0.45)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{
            position: 'absolute', top: 0, right: 0, height: '100%',
            width: 'min(288px, 85vw)',
            backgroundColor: '#5C2A00',
            backgroundImage: PAPER_NAV,
            backgroundSize: '200px 200px',
            borderLeft: '1px solid rgba(255,240,200,0.08)',
            boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
          }}>
            <div style={{ padding: 20 }}>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  float: 'right', width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8, background: 'rgba(255,240,200,0.06)',
                  border: 'none', color: 'rgba(255,240,200,0.5)', cursor: 'pointer', fontSize: '1rem',
                }}
              >✕</button>
              <div style={{ clear: 'both', paddingTop: 16 }}>
                {user && (
                  <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,240,200,0.08)' }}>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: '#FFF0C8' }}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', color: 'rgba(255,240,200,0.38)', marginTop: 2 }}>{user.email}</p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 600, marginTop: 8, color: '#E0A020' }}>
                      {user.role === 'PANDIT' ? '🙏 Pandit Account' : '👨‍👩‍👧 Family Account'}
                    </p>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{
                      display: 'block', padding: '10px 14px', borderRadius: 8,
                      fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem',
                      color: isActive(link.href) ? '#E0A020' : 'rgba(255,240,200,0.65)',
                      background: isActive(link.href) ? 'rgba(224,160,32,0.1)' : 'transparent',
                      textDecoration: 'none',
                    }}>
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,240,200,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {user ? (
                    <button onClick={() => { handleLogout(); setMobileOpen(false) }} style={{
                      textAlign: 'left', padding: '10px 14px', borderRadius: 8,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem',
                      color: 'rgba(220,100,100,0.9)',
                    }}>
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)} style={{
                        display: 'block', padding: '10px 14px', borderRadius: 8,
                        fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem',
                        color: 'rgba(255,240,200,0.65)', textDecoration: 'none',
                      }}>
                        Login
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)} style={{
                        display: 'block', padding: '10px 14px', borderRadius: 999,
                        fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', fontWeight: 600,
                        textAlign: 'center', color: '#fff', background: '#C84800',
                        textDecoration: 'none', boxShadow: '0 3px 12px rgba(200,72,0,0.3)',
                      }}>
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
