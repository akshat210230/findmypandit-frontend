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
  const pathname = usePathname()

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

  const navStyle: React.CSSProperties = {
    backgroundColor: '#5C2A00',
    backgroundImage: PAPER_NAV,
    backgroundSize: '200px 200px',
    backdropFilter: 'none',
    borderBottom: '1px solid rgba(255,240,200,0.08)',
    boxShadow: '0 2px 24px rgba(0,0,0,0.2)',
    isolation: 'isolate',
  }

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 64,
        display: 'flex', alignItems: 'center',
        padding: '0 40px',
        ...navStyle,
      }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

    </>
  )
}
