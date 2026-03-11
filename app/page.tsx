'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import AarambhLogo from '@/components/AarambhLogo'

const SERVICES = [
  { name: 'Wedding Ceremony', hindi: 'विवाह संस्कार', icon: '💍', desc: 'Complete Hindu wedding rituals with Vedic mantras and sacred fire' },
  { name: 'Griha Pravesh', hindi: 'गृह प्रवेश', icon: '🏠', desc: 'Housewarming puja to bless your new home with divine energy' },
  { name: 'Satyanarayan Katha', hindi: 'सत्यनारायण कथा', icon: '📿', desc: 'Devotional worship of Lord Vishnu for prosperity and peace' },
  { name: 'Ganesh Puja', hindi: 'गणेश पूजा', icon: '🕉️', desc: 'Invoke blessings of Lord Ganesha before new beginnings' },
  { name: 'Mundan Ceremony', hindi: 'मुंडन संस्कार', icon: '👶', desc: 'First head-shaving ceremony marking a child\'s sacred milestone' },
  { name: 'Navgraha Shanti', hindi: 'नवग्रह शांति', icon: '✨', desc: 'Planetary peace puja for harmony and removal of obstacles' },
]

const STEPS = [
  { num: '01', title: 'Choose Ceremony', desc: 'Select from 15+ sacred ceremonies and pujas', icon: '📋' },
  { num: '02', title: 'Find Your Pandit', desc: 'Browse verified pandits with ratings and reviews', icon: '🔍' },
  { num: '03', title: 'Pick Auspicious Time', desc: 'Our Choghadiya system suggests the best muhurat', icon: '🕉️' },
  { num: '04', title: 'Book & Celebrate', desc: 'Confirm instantly. Panditji arrives prepared.', icon: '🎉' },
]

const REVIEWS = [
  { name: 'Priya Mehta', city: 'Indore', text: 'Found the perfect pandit for my daughter\'s wedding. The Choghadiya feature helped us pick the most auspicious time!', rating: 5 },
  { name: 'Rajesh Kumar', city: 'Indore', text: 'Booked a Griha Pravesh puja for our new home. Panditji was punctual, knowledgeable and made everything special.', rating: 5 },
  { name: 'Sneha Patel', city: 'Indore', text: 'As someone new to the city, finding a trusted pandit felt impossible. Aarambh changed everything for our family.', rating: 5 },
]

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.12 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function RevealSection({ children, className = '', delay = 0, direction = 'up' }: {
  children: React.ReactNode, className?: string, delay?: number, direction?: 'up' | 'left' | 'right'
}) {
  const { ref, visible } = useScrollReveal()
  const hiddenTransform =
    direction === 'left'  ? 'translate(-64px, 0)' :
    direction === 'right' ? 'translate(64px, 0)'  :
                            'translate(0, 50px)'
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0,0)' : hiddenTransform,
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`
    }}>
      {children}
    </div>
  )
}

export default function HomePage() {
  const [visible, setVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Layered background */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,220,140,0.2) 0%, var(--bg) 55%, rgba(240,220,190,0.8) 100%)' }} />

        {/* Rotating mandala rings */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translateY(${scrollY * 0.06}px)` }}>
          <div className="animate-rotate-slow" style={{ opacity: 0.1 }}>
            <svg viewBox="0 0 600 600" style={{ width: 800, height: 800 }} fill="none" stroke="var(--card-dark)" strokeWidth="0.5">
              <circle cx="300" cy="300" r="290" strokeDasharray="4 8" />
              <circle cx="300" cy="300" r="240" />
              <circle cx="300" cy="300" r="190" strokeDasharray="2 6" />
              <circle cx="300" cy="300" r="140" />
              <circle cx="300" cy="300" r="90" strokeDasharray="3 5" />
              {[...Array(24)].map((_, i) => (
                <ellipse key={i} cx="300" cy="95" rx="18" ry="48" transform={`rotate(${i * 15} 300 300)`} />
              ))}
              {[...Array(12)].map((_, i) => (
                <ellipse key={`i${i}`} cx="300" cy="155" rx="12" ry="32" transform={`rotate(${i * 30} 300 300)`} />
              ))}
              {[...Array(16)].map((_, i) => (
                <line key={`l${i}`} x1="300" y1="10" x2="300" y2="590" transform={`rotate(${i * 11.25} 300 300)`} strokeWidth="0.3" />
              ))}
            </svg>
          </div>
          <div className="animate-rotate-reverse absolute" style={{ opacity: 0.03 }}>
            <svg viewBox="0 0 600 600" style={{ width: 600, height: 600 }} fill="none" stroke="var(--accent)" strokeWidth="0.8">
              {[...Array(8)].map((_, i) => (
                <ellipse key={i} cx="300" cy="60" rx="28" ry="70" transform={`rotate(${i * 45} 300 300)`} />
              ))}
            </svg>
          </div>
        </div>

        {/* Warm light rays from top */}
        <div className="absolute inset-0" style={{
          background: 'conic-gradient(from 270deg at 50% -20%, rgba(200,72,0,0.04) 0deg, transparent 60deg, rgba(200,72,0,0.03) 120deg, transparent 180deg, rgba(224,160,32,0.03) 240deg, transparent 300deg, rgba(200,72,0,0.04) 360deg)',
          transform: `translateY(${scrollY * 0.04}px)`
        }} />

        {/* Dot grid */}
        <div className="absolute inset-0" style={{ opacity: 0.04, backgroundImage: 'radial-gradient(var(--card-dark) 1.2px, transparent 1.2px)', backgroundSize: '28px 28px' }} />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">

          {/* Diya logo with flicker */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
            display: 'flex', justifyContent: 'center', marginBottom: 28
          }}>
            <div className="animate-flicker">
              <AarambhLogo size={64} showText={false} />
            </div>
          </div>

          {/* Eyebrow */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s',
            display: 'flex', justifyContent: 'center', marginBottom: 20
          }}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', backdropFilter: 'blur(8px)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-on-light2)', fontFamily: 'Outfit, sans-serif' }}>
                Trusted by 15,000+ families across India
              </span>
            </div>
          </div>

          {/* Main headline — Cormorant Garamond */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s'
          }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '-2px',
              marginBottom: 12,
              background: 'linear-gradient(135deg, var(--text-on-light) 0%, var(--accent) 30%, var(--gold) 50%, var(--accent) 70%, var(--text-on-light) 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'textShimmer 5s ease-in-out infinite',
            }}>
              Aarambh
            </h1>
          </div>

          {/* Hindi tagline */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s',
            marginBottom: 16
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              fontWeight: 500,
              fontStyle: 'italic',
              color: 'var(--text-on-light2)',
              letterSpacing: '0.5px'
            }}>
              जहाँ श्रद्धा मिले सेवा से
            </p>
          </div>

          {/* Subtitle */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.42s',
            marginBottom: 40
          }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', color: 'var(--text-on-light2)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Book verified pandits for weddings, pujas &amp; all Hindu ceremonies.
              Transparent pricing. Auspicious timing. Instant booking.
            </p>
          </div>

          {/* CTAs */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s',
            display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64
          }}>
            <Link href="/search" className="btn-shimmer"
              style={{
                fontFamily: 'Outfit, sans-serif',
                padding: '15px 36px',
                borderRadius: 'var(--r-pill)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#fff',
                background: 'var(--accent)',
                boxShadow: '0 8px 32px rgba(200,72,0,0.22), 0 2px 8px rgba(200,72,0,0.15)',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-h)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(200,72,0,0.28)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(200,72,0,0.22)' }}>
              Find a Pandit
            </Link>
            <Link href="/services"
              style={{
                fontFamily: 'Outfit, sans-serif',
                padding: '15px 36px',
                borderRadius: 'var(--r-pill)',
                fontSize: '1.05rem',
                fontWeight: 500,
                color: 'var(--text-on-light2)',
                border: '1.5px solid var(--card-border)',
                background: 'var(--card-light)',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)' }}>
              Explore Services →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 24, maxWidth: 520, margin: '0 auto' }}>
            {[
              { val: '15,000+', label: 'Pujas Done' },
              { val: '500+', label: 'Verified Pandits' },
              { val: '50+', label: 'Cities' },
              { val: '4.8★', label: 'Rating' },
            ].map((s, i) => (
              <div key={i} style={{
                textAlign: 'center',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${650 + i * 120}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${650 + i * 120}ms`
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', color: 'var(--text-on-light3)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            opacity: visible ? 0.6 : 0, transition: 'opacity 1s ease 1s' }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', color: 'var(--text-on-light3)', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
            <div style={{ width: 20, height: 32, borderRadius: 10, border: '1.5px solid var(--card-border)', display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
              <div className="animate-bounce" style={{ width: 4, height: 8, borderRadius: 2, background: 'var(--accent)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Divider */}
      <div style={{ padding: '0 24px' }}>
        <div className="sacred-divider" style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--gold-dim)' }}>ॐ</span>
        </div>
      </div>

      {/* ════════ HOW IT WORKS ════════ */}
      <section style={{ padding: '96px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Simple Process</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--text-on-light)' }}>
                Book a pandit in 4 steps
              </h2>
            </div>
          </RevealSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {STEPS.map((step, i) => (
              <RevealSection key={i} delay={i * 150}>
                <div className="card-hover card-light" style={{
                  padding: '32px 28px',
                  boxShadow: 'var(--shadow)',
                  height: '100%'
                }}>
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3.5rem', fontWeight: 700, color: 'var(--gold-dim)', lineHeight: 1 }}>{step.num}</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{step.icon}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-on-light)', marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem', color: 'var(--text-on-light2)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Divider */}
      <div style={{ padding: '0 24px' }}>
        <div className="sacred-divider" style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--gold-dim)' }}>✦</span>
        </div>
      </div>

      {/* ════════ SERVICES ════════ */}
      <section style={{ padding: '96px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Ceremonies</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--text-on-light)' }}>Sacred services we offer</h2>
              </div>
              <Link href="/services" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'gap 0.2s' }}>
                View all 15+ →
              </Link>
            </div>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {SERVICES.map((s, i) => (
              <RevealSection key={i} delay={i * 150}>
                <Link href={`/search?service=${encodeURIComponent(s.name)}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="card-hover card-light" style={{
                    padding: '32px 28px',
                    boxShadow: 'var(--shadow)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '5rem', opacity: 0.04, pointerEvents: 'none', fontFamily: "'Cormorant Garamond', serif", color: 'var(--accent)' }}>ॐ</div>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', marginBottom: 18 }}>{s.icon}</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-on-light)', marginBottom: 4 }}>{s.name}</h3>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: 'var(--text-on-light3)', fontWeight: 500, marginBottom: 10 }}>{s.hindi}</p>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem', color: 'var(--text-on-light2)', lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)' }}>Find Pandits →</span>
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Divider */}
      <div style={{ padding: '0 24px' }}>
        <div className="sacred-divider" style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--gold-dim)' }}>🪔</span>
        </div>
      </div>

      {/* ════════ CHOGHADIYA ════════ */}
      <section style={{ padding: '96px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>
            <RevealSection>
              <div>
                <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Unique Feature</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--text-on-light)', marginBottom: 20, lineHeight: 1.15 }}>
                  Book at the most<br />
                  <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>auspicious time</span>
                </h2>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: 'var(--text-on-light2)', lineHeight: 1.75, marginBottom: 32 }}>
                  Our built-in Choghadiya calculator shows the most auspicious time slots for your ceremony based on Vedic astrology.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Amrit, Shubh & Labh periods highlighted in green', 'Rog, Kaal & Udveg marked to avoid', 'Updates automatically for every date'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, background: 'var(--green-s)', color: 'var(--green)', flexShrink: 0 }}>✓</div>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: 'var(--text-on-light2)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
            <RevealSection delay={150}>
              <div className="card-light" style={{ padding: 28, boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: '1.2rem' }}>🕉️</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-on-light)' }}>Din ka Choghadiya</span>
                  <span className="badge ml-auto" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>Sat, 22 Feb</span>
                </div>
                {[
                  { name: 'Amrit', time: '6:00–7:30 AM', type: 'best', color: '#16a34a', bg: 'var(--green-s)' },
                  { name: 'Shubh', time: '7:30–9:00 AM', type: 'good', color: '#2D8F4E', bg: 'var(--green-s)' },
                  { name: 'Rog', time: '9:00–10:30 AM', type: 'bad', color: 'var(--red)', bg: 'var(--red-s)' },
                  { name: 'Labh', time: '10:30–12:00 PM', type: 'good', color: '#65a30d', bg: 'var(--green-s)' },
                  { name: 'Kaal', time: '12:00–1:30 PM', type: 'bad', color: 'var(--red)', bg: 'var(--red-s)' },
                ].map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-sm)', marginBottom: 8,
                    background: i === 0 ? 'var(--accent-bg)' : 'transparent',
                    border: i === 0 ? '1.5px solid var(--accent-border)' : '1.5px solid var(--card-border)',
                    opacity: s.type === 'bad' ? 0.45 : 1,
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-on-light)', flex: 1 }}>{s.name}</span>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem', color: 'var(--text-on-light3)' }}>{s.time}</span>
                    <span className="badge" style={{ background: s.bg, color: s.color, fontSize: '0.65rem' }}>
                      {s.type === 'best' ? 'BEST' : s.type === 'good' ? 'GOOD' : 'AVOID'}
                    </span>
                  </div>
                ))}
                <Link href="/search" className="btn-primary btn-shimmer" style={{
                  display: 'block', width: '100%', marginTop: 20,
                  textAlign: 'center', textDecoration: 'none',
                }}>
                  Try it Now — Book a Pandit
                </Link>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Sacred Divider */}
      <div style={{ padding: '0 24px' }}>
        <div className="sacred-divider" style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--gold-dim)' }}>✦</span>
        </div>
      </div>

      {/* ════════ TESTIMONIALS ════════ */}
      <section style={{ padding: '96px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Testimonials</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--text-on-light)' }}>Hear from our families</h2>
            </div>
          </RevealSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {REVIEWS.map((r, i) => (
              <RevealSection key={i} delay={i * 120} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className="card-hover card-light" style={{
                  padding: '32px 28px',
                  boxShadow: 'var(--shadow)',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 16, right: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: '4rem', color: 'var(--gold-dim)', lineHeight: 1 }}>"</div>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                    {[...Array(r.rating)].map((_, j) => <span key={j} style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>★</span>)}
                  </div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: 'var(--text-on-light2)', lineHeight: 1.7, marginBottom: 24 }}>&ldquo;{r.text}&rdquo;</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, var(--accent), var(--gold))', flexShrink: 0 }}>
                      {r.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-on-light)' }}>{r.name}</div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: 'var(--text-on-light3)' }}>{r.city}</div>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section style={{ padding: '96px 24px', background: 'var(--card-dark)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.015, backgroundImage: 'radial-gradient(var(--text-on-dark) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.04, fontFamily: "'Cormorant Garamond', serif", fontSize: '28rem', color: 'var(--gold)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>ॐ</div>
        <RevealSection>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div className="animate-flicker"><AarambhLogo size={52} showText={false} /></div>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', fontWeight: 700, color: 'var(--text-on-dark)', lineHeight: 1, marginBottom: 8 }}>Aarambh</h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--text-on-dark2)', marginBottom: 12 }}>जहाँ श्रद्धा मिले सेवा से</p>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: 'var(--text-on-dark2)', marginBottom: 40, lineHeight: 1.7 }}>Join 15,000+ happy families. It only takes a few seconds to get started.</p>
            <Link href="/register" className="btn-shimmer" style={{
              fontFamily: 'Outfit, sans-serif',
              display: 'inline-block', padding: '16px 48px', borderRadius: 'var(--r-pill)',
              fontSize: '1.05rem', fontWeight: 700, color: '#fff',
              background: 'var(--accent)',
              boxShadow: '0 8px 40px rgba(200,72,0,0.35)',
              textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)'
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-h)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 56px rgba(200,72,0,0.45)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(200,72,0,0.35)' }}>
              Get Started — It&apos;s Free
            </Link>
          </div>
        </RevealSection>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{ padding: '60px 24px', background: 'var(--nav)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <AarambhLogo size={28} showText={false} />
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-on-dark)' }}>Aarambh</span>
              </div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: 'var(--text-on-dark3)', lineHeight: 1.7 }}>
                जहाँ श्रद्धा मिले सेवा से<br />
                India&apos;s trusted platform for booking verified pandits.
              </p>
            </div>
            {[
              { title: 'Services', links: [['Wedding', '/services'], ['Griha Pravesh', '/services'], ['Satyanarayan', '/services'], ['All Services', '/services']] },
              { title: 'Company', links: [['About', '/'], ['How It Works', '/'], ['For Pandits', '/'], ['Contact', '/']] },
              { title: 'Legal', links: [['Privacy Policy', '/'], ['Terms', '/'], ['Refund Policy', '/']] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2.5px', color: 'var(--text-on-dark3)', marginBottom: 16 }}>{col.title}</h4>
                {col.links.map(([label, href], j) => (
                  <Link key={j} href={href} style={{ fontFamily: 'Outfit, sans-serif', display: 'block', fontSize: '0.85rem', color: 'var(--text-on-dark3)', textDecoration: 'none', padding: '4px 0', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-on-dark)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-on-dark3)'}>
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(255,240,200,0.08)', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem', color: 'var(--text-on-dark3)' }}>© 2026 Aarambh. All rights reserved.</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem', color: 'var(--text-on-dark3)' }}>Made with ❤️ in Indore, India</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
