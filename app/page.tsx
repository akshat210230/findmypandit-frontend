'use client'

import Link from 'next/link'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'

// ── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:           '#F0E2C8',
  cardDark:     '#6B3010',
  cardDarkH:    '#7E3C18',
  cardBorder:   'rgba(107,48,16,0.14)',
  cardLight:    'rgba(255,248,235,0.72)',
  textOnDark:   '#FFF0C8',
  textOnDark2:  'rgba(255,240,200,0.65)',
  textOnDark3:  'rgba(255,240,200,0.38)',
  textOnLight:  '#2C1A08',
  textOnLight2: 'rgba(44,26,8,0.6)',
  textOnLight3: 'rgba(44,26,8,0.38)',
  gold:         '#E0A020',
  goldDim:      'rgba(224,160,32,0.55)',
  accent:       '#C84800',
  accentBg:     'rgba(200,72,0,0.1)',
  accentBorder: 'rgba(200,72,0,0.22)',
  shadow:       '0 4px 24px rgba(44,26,8,0.1)',
  shadowLg:     '0 12px 40px rgba(44,26,8,0.18)',
}

const PAPER_LIGHT = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.055'/%3E%3C/svg%3E\")"
const PAPER_DARK  = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E\")"

const SECTION_BG: React.CSSProperties = {
  backgroundColor: T.bg,
  backgroundImage: PAPER_LIGHT,
  backgroundSize: '200px 200px',
}

// ── Root page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 4px 20px rgba(200,72,0,0.4), 0 0 0 0 rgba(200,72,0,0.3); }
          50%       { box-shadow: 0 4px 20px rgba(200,72,0,0.4), 0 0 0 8px transparent; }
        }
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: repeat(2,1fr) !important; }
          .pandits-grid  { grid-template-columns: 1fr !important; }
          .steps-grid    { grid-template-columns: 1fr !important; }
          .samagri-grid  { grid-template-columns: 1fr !important; }
          .connector-line { display: none !important; }
          .footer-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ background: T.bg, fontFamily: "'Outfit', sans-serif" }}>
        <ScrollExpandMedia
          mediaType="image"
          mediaSrc="https://images.unsplash.com/photo-1604423586580-0e8c5ac5ef47?q=80&w=1920&auto=format&fit=crop"
          bgImageSrc="https://images.unsplash.com/photo-1604423586580-0e8c5ac5ef47?q=80&w=1920&auto=format&fit=crop"
          title="Aarambh"
          scrollToExpand="जहाँ श्रद्धा मिले सेवा से"
          textBlend={false}
        >
          <div style={{ height: 0 }} />
        </ScrollExpandMedia>
        <div style={{ height: 220, marginTop: -4, background: 'linear-gradient(to bottom, #0a0502 0%, #1a0d04 8%, #2e1608 18%, #3d1f0a 30%, #8a6040 52%, #b89060 68%, #d4b48a 82%, #e8d4b0 92%, #F0E2C8 100%)', position: 'relative', zIndex: 2 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 100% at 50% 0%, rgba(200,120,40,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        </div>
        <ServicesSection />
        <SamagriSection />
        <HowItWorksSection />
        <FeaturedPanditsSection />
        <Footer />
      </main>
    </>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection({ canvasRef, scrollRatio }: { canvasRef: React.RefObject<HTMLCanvasElement>; scrollRatio: number }) {
  const textPhase = Math.max(0, (scrollRatio - 0.25) / 0.35)
  const textY = textPhase * -60
  const textOpacity = Math.max(0, 1 - textPhase * 1.2)
  const hintOpacity = Math.max(0, 1 - scrollRatio * 8)

  return (
    <section id="hero-scene" style={{ height: '280vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />

        {/* Text overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>

          <div style={{ textAlign: 'center', padding: '0 20px', transform: `translateY(${textY}px)`, opacity: textOpacity }}>
            <div style={{ textAlign: 'center', marginBottom: 24, pointerEvents: 'none' }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: 'clamp(4rem,9vw,7rem)',
                letterSpacing: '0.06em',
                lineHeight: 1,
                display: 'block',
                background: 'linear-gradient(135deg, #C8840A 0%, #E8B830 22%, #FFF5B0 45%, #F0C830 62%, #E0A020 80%, #B87010 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: 'goldShimmer 3.5s ease-in-out infinite',
                marginBottom: 14,
              }}>
                Aarambh
              </span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 'clamp(0.82rem,1.6vw,1rem)', letterSpacing: '0.28em', color: 'rgba(255,240,200,0.52)', display: 'block' }}>
                जहाँ श्रद्धा मिले सेवा से
              </span>
            </div>
            <p style={{ fontSize: '1rem', color: T.textOnDark2, lineHeight: 1.65, maxWidth: 480, margin: '0 auto 28px', fontFamily: "'Outfit', sans-serif", animation: 'fadeUp 0.9s 0.75s ease both' }}>
              Connect with verified pandits for every ceremony. Guided by tradition, powered by trust.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', animation: 'fadeUp 1s 1s ease both', pointerEvents: 'all' }}>
              <Link href="/search" style={{ background: T.accent, color: '#fff', borderRadius: 999, padding: '13px 32px', fontSize: '0.95rem', fontWeight: 600, fontFamily: "'Outfit', sans-serif", textDecoration: 'none', display: 'inline-block', animation: 'pulseRing 2.5s ease-in-out infinite' }}>
                Book a Pandit
              </Link>
              <Link href="/services" style={{ background: 'transparent', color: T.textOnDark2, border: '1.5px solid rgba(255,240,200,0.25)', borderRadius: 999, padding: '12px 28px', fontSize: '0.92rem', fontFamily: "'Outfit', sans-serif", textDecoration: 'none', display: 'inline-block' }}>
                Browse Ceremonies
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 25, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: hintOpacity, transition: 'opacity 0.3s' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(224,160,32,0.5)', fontFamily: "'Outfit', sans-serif" }}>
            Scroll to enter
          </span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(224,160,32,0.6))', animation: 'scrollPulse 1.8s ease-in-out infinite' }} />
        </div>

      </div>
    </section>
  )
}

// ── Services ──────────────────────────────────────────────────────────────────
const SERVICE_BADGE: Record<string, React.CSSProperties> = {
  Popular: { background: 'rgba(224,160,32,0.12)', color: '#E0A020',             border: '1px solid rgba(224,160,32,0.25)'  },
  Premium: { background: 'rgba(200,72,0,0.1)',    color: '#C84800',             border: '1px solid rgba(200,72,0,0.22)'    },
  '2 hrs': { background: 'rgba(44,26,8,0.25)',    color: 'rgba(255,240,200,0.6)', border: '1px solid rgba(255,240,200,0.1)' },
  Quick:   { background: 'rgba(46,125,58,0.1)',   color: '#2E7D3A',             border: '1px solid rgba(46,125,58,0.2)'    },
}

function ServicesSection() {
  const services = [
    { icon: '🏠', name: 'Griha Pravesh',      desc: 'Sacred housewarming for new beginnings',       price: '₹5,100',  badge: 'Popular', delay: '0s'   },
    { icon: '💍', name: 'Vivah Sanskar',       desc: 'Vedic wedding ceremony with full rituals',      price: '₹21,000', badge: 'Premium', delay: '0.1s' },
    { icon: '🕉️', name: 'Satyanarayan Katha', desc: 'Monthly puja for blessings and prosperity',     price: '₹3,100',  badge: '2 hrs',   delay: '0.2s' },
    { icon: '🐘', name: 'Ganesh Puja',         desc: 'Remove obstacles and invite success',           price: '₹2,500',  badge: 'Quick',   delay: '0.3s' },
  ]

  return (
    <section style={{ ...SECTION_BG, padding: '60px 40px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.accent, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>
            Our Ceremonies
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(1.7rem,3vw,2.3rem)', color: T.textOnLight, marginBottom: 8 }}>
            Sacred Services
          </h2>
          <p style={{ fontSize: '0.9rem', color: T.textOnLight2, fontFamily: "'Outfit', sans-serif" }}>
            Choose from 15+ puja and ceremony types
          </p>
        </div>

        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, alignItems: 'stretch' }}>
          {services.map((s, i) => (
            <Link key={s.name} href="/services" style={{ textDecoration: 'none', display: 'flex' }}>
              <div
                style={{
                  backgroundColor: T.cardDark,
                  backgroundImage: PAPER_DARK, backgroundSize: '120px 120px',
                  border: '1px solid rgba(255,243,212,0.07)',
                  borderRadius: 18, padding: '22px 20px',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                  animation: `fadeUp 0.5s ${s.delay} ease both`,
                  display: 'flex', flexDirection: 'column',
                  width: '100%',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(-4px)'
                  el.style.backgroundColor = T.cardDarkH
                  el.style.boxShadow = T.shadowLg
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(0)'
                  el.style.backgroundColor = T.cardDark
                  el.style.boxShadow = 'none'
                }}
              >
                {/* OM watermark */}
                <div style={{ position: 'absolute', right: 12, top: 6, fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', color: 'rgba(255,240,200,0.05)', pointerEvents: 'none' }}>ॐ</div>

                {/* Icon — fixed height slot */}
                <div style={{ height: 48, display: 'flex', alignItems: 'center', marginBottom: 14, fontSize: '2rem', lineHeight: 1, animation: `float 3.5s ease-in-out ${i * 0.3}s infinite` }}>
                  {s.icon}
                </div>

                {/* Name */}
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 700, color: T.textOnDark, marginBottom: 8 }}>
                  {s.name}
                </div>

                {/* Desc — grows to fill */}
                <p style={{ fontSize: '0.8rem', color: T.textOnDark2, fontFamily: "'Outfit', sans-serif", lineHeight: 1.55, flex: 1, marginBottom: 0 }}>
                  {s.desc}
                </p>

                {/* Price + badge — pinned to bottom */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.gold, fontSize: '1.3rem' }}>
                    {s.price}
                  </span>
                  <span style={{ ...SERVICE_BADGE[s.badge], borderRadius: 999, fontSize: '0.7rem', fontWeight: 600, padding: '4px 12px', fontFamily: "'Outfit', sans-serif", display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {s.badge}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Samagri ───────────────────────────────────────────────────────────────────
function SamagriSection() {
  const items = [
    { icon: '🌺', label: 'Flowers & Garlands' },
    { icon: '🪔', label: 'Diyas & Wicks'      },
    { icon: '🌾', label: 'Grains & Offerings' },
    { icon: '🧨', label: 'Incense & Dhoop'    },
  ]
  return (
    <section style={{ ...SECTION_BG, padding: '0 40px 60px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div className="samagri-grid" style={{
          backgroundColor: T.cardDark, backgroundImage: PAPER_DARK, backgroundSize: '120px 120px',
          borderRadius: 18, padding: '40px 48px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center',
          border: '1px solid rgba(255,243,212,0.07)',
        }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.accent, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>
              AI-Powered Samagri
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '2rem', color: T.textOnDark, lineHeight: 1.2, marginBottom: 14 }}>
              Everything for the ceremony,<br />
              <em style={{ color: T.gold }}>delivered to your door.</em>
            </h3>
            <p style={{ fontSize: '0.9rem', color: T.textOnDark2, lineHeight: 1.65, marginBottom: 24, fontFamily: "'Outfit', sans-serif", maxWidth: 420 }}>
              Our AI samagri advisor recommends exactly what you need — no guesswork, no missing items.
            </p>
            <Link href="/samagri" style={{ display: 'inline-block', textDecoration: 'none', background: `linear-gradient(135deg, ${T.gold} 0%, #B87800 100%)`, color: '#2C1A08', fontWeight: 700, fontFamily: "'Outfit', sans-serif", borderRadius: 999, padding: '12px 28px', fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(224,160,32,0.3)' }}>
              Explore Samagri
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {items.map(item => (
              <div key={item.label} style={{ background: 'rgba(255,240,200,0.07)', border: '1px solid rgba(255,240,200,0.12)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: '0.78rem', color: T.textOnDark2, fontFamily: "'Outfit', sans-serif", lineHeight: 1.4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { n: '1', title: 'Choose Your Ceremony', body: 'Browse 15+ sacred ceremonies and select the one that fits your occasion and tradition.' },
    { n: '2', title: 'Find Your Pandit',      body: 'Filter by city, view verified profiles, read reviews, and check real-time availability.' },
    { n: '3', title: 'Confirm & Celebrate',   body: 'Book securely, pay online, and receive a full confirmation with every detail.' },
  ]
  return (
    <section style={{ ...SECTION_BG, padding: '60px 40px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.accent, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>
            Simple Process
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(1.7rem,3vw,2.3rem)', color: T.textOnLight }}>
            Book in 3 Steps
          </h2>
        </div>
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, position: 'relative' }}>
          <div className="connector-line" style={{ position: 'absolute', top: 24, left: '33%', right: '33%', height: 1, borderTop: `1px dashed ${T.accentBorder}`, zIndex: 0 }} />
          {steps.map(step => (
            <div key={step.n} style={{ textAlign: 'center', padding: '0 32px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${T.accentBorder}`, color: T.accent, background: T.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, margin: '0 auto 20px' }}>
                {step.n}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '1.35rem', color: T.textOnLight, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: '0.85rem', color: T.textOnLight2, lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Featured Pandits ──────────────────────────────────────────────────────────
function FeaturedPanditsSection() {
  const pandits = [
    { id: 'ramesh-sharma', initial: 'र', name: 'Pt. Ramesh Sharma', city: 'Indore', exp: 12, rating: 4.9, reviews: 48, price: '₹5,100', specs: ['Griha Pravesh', 'Satyanarayan'], badge: 'Available',  badgeColor: 'green' as const },
    { id: 'vijay-mishra',  initial: 'व', name: 'Pt. Vijay Mishra',  city: 'Indore', exp: 15, rating: 5.0, reviews: 62, price: '₹9,000', specs: ['All Ceremonies'],               badge: 'Top Rated', badgeColor: 'gold'  as const },
    { id: 'anil-dubey',   initial: 'अ', name: 'Pt. Anil Dubey',    city: 'Indore', exp: 8,  rating: 4.2, reviews: 31, price: '₹7,500', specs: ['Vivah Sanskar', 'Ganesh Puja'], badge: null,        badgeColor: null              },
  ]

  const BADGE_COLORS: Record<string, React.CSSProperties> = {
    green: { background: 'rgba(46,125,58,0.1)',   color: '#2E7D3A', border: '1px solid rgba(46,125,58,0.2)'   },
    gold:  { background: 'rgba(224,160,32,0.12)',  color: T.gold,   border: '1px solid rgba(224,160,32,0.25)' },
  }

  return (
    <section style={{ ...SECTION_BG, padding: '60px 40px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.accent, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>
              Our Pandits
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(1.7rem,3vw,2.3rem)', color: T.textOnLight, marginBottom: 4 }}>
              Verified & Trusted
            </h2>
            <p style={{ fontSize: '0.88rem', color: T.textOnLight2, fontFamily: "'Outfit', sans-serif" }}>
              All pandits are background-checked and reviewed by families.
            </p>
          </div>
          <Link href="/search" style={{ fontSize: '0.85rem', color: T.accent, fontFamily: "'Outfit', sans-serif", fontWeight: 600, textDecoration: 'none' }}>
            View All Pandits →
          </Link>
        </div>

        <div className="pandits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'stretch' }}>
          {pandits.map(p => (
            <div
              key={p.id}
              style={{
                backgroundColor: T.cardLight,
                backgroundImage: PAPER_LIGHT, backgroundSize: '200px 200px',
                border: `1px solid ${T.cardBorder}`,
                borderRadius: 18, padding: 22,
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex', flexDirection: 'column',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = T.shadow }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
              onClick={() => { window.location.href = `/pandit/${p.id}` }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: T.cardDark, border: '2px solid rgba(224,160,32,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.45rem', color: T.gold }}>
                  {p.initial}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '1.35rem', color: T.textOnLight, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: '0.72rem', color: T.textOnLight2, fontFamily: "'Outfit', sans-serif" }}>{p.city} • {p.exp} yrs exp</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
                    {[0,1,2,3,4].map(i => (
                      <span key={i} style={{ color: i < Math.floor(p.rating) ? T.gold : 'rgba(44,26,8,0.2)', fontSize: '0.85rem' }}>★</span>
                    ))}
                    <span style={{ fontSize: '0.72rem', color: T.textOnLight2, marginLeft: 4, fontFamily: "'Outfit', sans-serif" }}>
                      {p.rating} ({p.reviews})
                    </span>
                  </div>
                </div>
                {p.badge && p.badgeColor && (
                  <span style={{ ...BADGE_COLORS[p.badgeColor], borderRadius: 999, fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', fontFamily: "'Outfit', sans-serif", flexShrink: 0 }}>
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: T.cardBorder, margin: '0 0 14px' }} />

              {/* Specialty badges */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 32, marginBottom: 14 }}>
                {p.specs.map(spec => (
                  <span key={spec} style={{ background: 'rgba(44,26,8,0.06)', color: T.textOnLight2, border: `1px solid ${T.cardBorder}`, borderRadius: 999, fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', fontFamily: "'Outfit', sans-serif" }}>
                    {spec}
                  </span>
                ))}
              </div>

              {/* Price + Book — pinned to bottom */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.gold, fontSize: '1.2rem' }}>
                  {p.price}
                </span>
                <Link
                  href={`/book/${p.id}`}
                  onClick={e => e.stopPropagation()}
                  style={{ background: T.accent, color: '#fff', borderRadius: 999, padding: '8px 18px', fontSize: '0.78rem', fontWeight: 600, fontFamily: "'Outfit', sans-serif", textDecoration: 'none', border: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function DiyaSmall() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 28, flexShrink: 0 }}>
      <ellipse cx="24" cy="38" rx="14" ry="5" fill="#D4651E" opacity="0.18"/>
      <path d="M24 8 C22 12 19 16 19 20 C19 23 21 26 24 26 C27 26 29 23 29 20 C29 16 26 12 24 8Z" fill="url(#fg)"/>
      <path d="M24 12 C23 14 21.5 17 21.5 19.5 C21.5 21.5 22.5 23 24 23 C25.5 23 26.5 21.5 26.5 19.5 C26.5 17 25 14 24 12Z" fill="#FFC857" opacity="0.85"/>
      <ellipse cx="24" cy="26" rx="5.5" ry="2" fill="#D4651E"/>
      <ellipse cx="24" cy="26" rx="4" ry="1.2" fill="#E88030"/>
      <defs>
        <linearGradient id="fg" x1="24" y1="8" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8C00"/>
          <stop offset="40%" stopColor="#E8732A"/>
          <stop offset="100%" stopColor="#D4651E"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function Footer() {
  const footerLinks = ['Services', 'Find Pandits', 'Dashboard', 'About Us']
  const footerHrefs = ['/services', '/search', '/dashboard', '/']

  return (
    <footer style={{
      backgroundColor: '#3D1A00',
      backgroundImage: PAPER_DARK, backgroundSize: '120px 120px',
      borderTop: '1px solid rgba(255,240,200,0.08)',
      padding: '48px 40px 28px',
      color: 'rgba(255,240,200,0.65)',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>

          {/* Column 1 — Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <DiyaSmall />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '1.4rem', color: '#FFF0C8' }}>
                Aarambh
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,240,200,0.4)', letterSpacing: '0.08em', marginTop: 4, marginBottom: 12 }}>
              जहाँ श्रद्धा मिले सेवा से
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,240,200,0.5)', lineHeight: 1.6, maxWidth: 260 }}>
              Connecting families with trusted pandits across India.
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,240,200,0.35)', marginBottom: 14 }}>
              Quick Links
            </div>
            {footerLinks.map((label, i) => (
              <Link key={label} href={footerHrefs[i]} style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,240,200,0.55)', marginBottom: 10, textDecoration: 'none', transition: 'color 0.18s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,240,200,0.9)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,240,200,0.55)' }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Column 3 — Contact */}
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,240,200,0.35)', marginBottom: 14 }}>
              Get In Touch
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,240,200,0.5)', marginBottom: 8 }}>📍 Indore, Madhya Pradesh</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,240,200,0.5)', marginBottom: 8 }}>📧 hello@aarambh.in</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,240,200,0.5)' }}>🕐 Available 6 AM – 10 PM</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,240,200,0.08)', marginTop: 36, marginBottom: 20 }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,240,200,0.3)' }}>
            © 2025 Aarambh. All rights reserved.
          </span>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,240,200,0.3)' }}>
            Made with 🪔 for every sacred occasion
          </span>
        </div>
      </div>
    </footer>
  )
}
