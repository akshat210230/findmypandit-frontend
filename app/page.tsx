'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AarambhLogo from '@/components/AarambhLogo'

const SERVICES = [
  { name: 'Wedding Ceremony', hindi: 'विवाह संस्कार', icon: '💍', desc: 'Complete Hindu wedding rituals with Vedic mantras' },
  { name: 'Griha Pravesh', hindi: 'गृह प्रवेश', icon: '🏠', desc: 'Housewarming puja for your new home' },
  { name: 'Satyanarayan Katha', hindi: 'सत्यनारायण कथा', icon: '📿', desc: 'Devotional worship of Lord Vishnu' },
  { name: 'Ganesh Puja', hindi: 'गणेश पूजा', icon: '🕉️', desc: 'Invoke blessings of Lord Ganesha' },
  { name: 'Mundan Ceremony', hindi: 'मुंडन संस्कार', icon: '👶', desc: 'First head-shaving ceremony for child' },
  { name: 'Navgraha Shanti', hindi: 'नवग्रह शांति', icon: '✨', desc: 'Planetary peace puja for harmony' },
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

export default function HomePage() {
  const [visible, setVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setVisible(true)
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div style={{ background: '#FFFAF5', minHeight: '100vh' }}>

      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #FFF5EC 0%, #FFFAF5 40%, #FEF0E4 100%)' }} />

        {/* Mandala pattern */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.04, transform: `translateY(${scrollY * 0.08}px)` }}>
          <svg viewBox="0 0 500 500" style={{ width: 700, height: 700 }} fill="none" stroke="#C05818" strokeWidth="0.6">
            <circle cx="250" cy="250" r="240" /><circle cx="250" cy="250" r="200" /><circle cx="250" cy="250" r="160" /><circle cx="250" cy="250" r="120" /><circle cx="250" cy="250" r="80" /><circle cx="250" cy="250" r="40" />
            {[...Array(16)].map((_, i) => <ellipse key={i} cx="250" cy="90" rx="22" ry="55" transform={`rotate(${i * 22.5} 250 250)`} />)}
            {[...Array(8)].map((_, i) => <line key={`l${i}`} x1="250" y1="10" x2="250" y2="490" transform={`rotate(${i * 22.5} 250 250)`} />)}
          </svg>
        </div>

        {/* Dots */}
        <div className="absolute inset-0" style={{ opacity: 0.025, backgroundImage: 'radial-gradient(#C05818 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* Glow orbs */}
        <div className="absolute top-[-15%] right-[-8%] w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(232,128,48,0.08) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,101,30,0.06) 0%, transparent 65%)' }} />

        {/* Content */}
        <div className={`relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Logo large */}
          <div className="flex justify-center mb-6">
            <AarambhLogo size={56} showText={false} />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6"
            style={{ background: 'rgba(212,101,30,0.07)', border: '1px solid rgba(212,101,30,0.12)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2D8F4E' }} />
            <span className="text-sm font-medium" style={{ color: '#7A6350' }}>Trusted by 15,000+ families across India</span>
          </div>

          {/* Brand name */}
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', lineHeight: 1.05, marginBottom: 8, color: '#2C1810', fontWeight: 800, letterSpacing: '-1px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #D4651E, #E88030, #B8860B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Aarambh</span>
          </h1>

          {/* Catchline in Hindi */}
          <p className="text-xl sm:text-2xl font-semibold mb-3" style={{ color: '#4A3728' }}>
            जहाँ श्रद्धा मिले सेवा से
          </p>

          {/* English subtitle */}
          <p className="text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed" style={{ color: '#7A6350' }}>
            Book verified pandits for weddings, pujas & all Hindu ceremonies.
            Transparent pricing. Auspicious timing. Instant booking.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/search"
              className="group px-8 py-4 rounded-2xl text-lg font-bold text-white relative overflow-hidden transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)', boxShadow: '0 8px 32px rgba(212,101,30,0.2)' }}>
              <span className="relative z-10">Find a Pandit</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link href="/services"
              className="px-8 py-4 rounded-2xl text-lg font-medium transition-all hover:-translate-y-0.5"
              style={{ color: '#7A6350', border: '1.5px solid rgba(180,130,80,0.2)', background: 'rgba(255,255,255,0.5)' }}>
              Explore Services →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {[
              { val: '15,000+', label: 'Pujas Completed' },
              { val: '500+', label: 'Verified Pandits' },
              { val: '50+', label: 'Cities' },
              { val: '4.8★', label: 'Average Rating' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold mb-1" style={{ color: '#D4651E' }}>{s.val}</div>
                <div className="text-xs font-medium" style={{ color: '#B09980' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-2">
            <span className="text-xs font-medium" style={{ color: '#B09980' }}>Scroll</span>
            <div className="w-5 h-8 rounded-full flex justify-center pt-1.5" style={{ border: '1.5px solid rgba(180,130,80,0.2)' }}>
              <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: '#D4651E' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section className="py-24 px-6" style={{ background: '#FFFAF5' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-[3px] uppercase mb-4 block" style={{ color: '#D4651E' }}>Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#2C1810' }}>Book a pandit in 4 steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <div key={i} className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)', boxShadow: '0 2px 12px rgba(120,80,30,0.04)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-extrabold" style={{ color: 'rgba(212,101,30,0.12)' }}>{step.num}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#2C1810' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6350' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SERVICES ════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #FFFAF5, #FFF5EC, #FFFAF5)' }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold tracking-[3px] uppercase mb-4 block" style={{ color: '#D4651E' }}>Ceremonies</span>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#2C1810' }}>Sacred services we offer</h2>
            </div>
            <Link href="/services" className="hidden sm:block text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ color: '#D4651E' }}>View all 15+ →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <Link href={`/search?service=${encodeURIComponent(s.name)}`} key={i}
                className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)', boxShadow: '0 2px 12px rgba(120,80,30,0.04)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: 'rgba(212,101,30,0.06)' }}>{s.icon}</div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#2C1810' }}>{s.name}</h3>
                <p className="text-xs mb-3 font-semibold" style={{ color: '#B09980' }}>{s.hindi}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6350' }}>{s.desc}</p>
                <div className="mt-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#D4651E' }}>Find Pandits →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CHOGHADIYA ════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FEF0E4, #FFF5EC)' }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-sm font-semibold tracking-[3px] uppercase mb-4 block" style={{ color: '#D4651E' }}>Unique Feature</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: '#2C1810' }}>
                Book at the most<br /><span style={{ color: '#D4651E' }}>auspicious time</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#7A6350' }}>
                Our built-in Choghadiya calculator shows the most auspicious time slots for your ceremony based on Vedic astrology.
              </p>
              <div className="space-y-3">
                {['Amrit, Shubh & Labh periods highlighted in green', 'Rog, Kaal & Udveg marked to avoid', 'Updates automatically for every date'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#E8F5EC', color: '#2D8F4E' }}>✓</div>
                    <span className="text-sm" style={{ color: '#7A6350' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.1)', boxShadow: '0 8px 40px rgba(120,80,30,0.06)' }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">🕉️</span>
                <span className="font-bold" style={{ color: '#2C1810' }}>Din ka Choghadiya</span>
                <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(212,101,30,0.08)', color: '#D4651E' }}>Sat, 22 Feb</span>
              </div>
              {[
                { name: 'Amrit', time: '6:00–7:30 AM', type: 'best', color: '#16a34a', bg: '#E8F5EC' },
                { name: 'Shubh', time: '7:30–9:00 AM', type: 'good', color: '#2D8F4E', bg: '#E8F5EC' },
                { name: 'Rog', time: '9:00–10:30 AM', type: 'bad', color: '#C53030', bg: '#FEE8E8' },
                { name: 'Labh', time: '10:30–12:00 PM', type: 'good', color: '#65a30d', bg: '#F0FFF0' },
                { name: 'Kaal', time: '12:00–1:30 PM', type: 'bad', color: '#C53030', bg: '#FEE8E8' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl mb-2"
                  style={{ background: i === 0 ? 'rgba(212,101,30,0.04)' : s.type === 'bad' ? 'rgba(197,48,48,0.03)' : 'rgba(0,0,0,0.01)', border: i === 0 ? '1.5px solid rgba(212,101,30,0.15)' : '1.5px solid transparent', opacity: s.type === 'bad' ? 0.45 : 1 }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="font-semibold text-sm flex-1" style={{ color: '#2C1810' }}>{s.name}</span>
                  <span className="text-xs" style={{ color: '#B09980' }}>{s.time}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: s.bg, color: s.color }}>
                    {s.type === 'best' ? 'BEST' : s.type === 'good' ? 'GOOD' : 'AVOID'}
                  </span>
                </div>
              ))}
              <Link href="/search" className="block w-full mt-5 py-3.5 rounded-xl text-center font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)', boxShadow: '0 4px 20px rgba(212,101,30,0.18)' }}>
                Try it Now — Book a Pandit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section className="py-24 px-6" style={{ background: '#FFFAF5' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold tracking-[3px] uppercase mb-4 block" style={{ color: '#D4651E' }}>Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#2C1810' }}>Hear from our families</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="p-6 rounded-2xl transition-all hover:-translate-y-1"
                style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)', boxShadow: '0 2px 12px rgba(120,80,30,0.04)' }}>
                <div className="flex gap-0.5 mb-4">{[...Array(r.rating)].map((_, j) => <span key={j} style={{ color: '#D4A017', fontSize: 14 }}>★</span>)}</div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#7A6350' }}>&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #D4651E, #B8860B)' }}>
                    {r.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#2C1810' }}>{r.name}</div>
                    <div className="text-xs" style={{ color: '#B09980' }}>{r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FEF0E4, #FFF5EC)' }} />
        <div className="absolute inset-0" style={{ opacity: 0.02, backgroundImage: 'radial-gradient(#C05818 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6"><AarambhLogo size={48} showText={false} /></div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-2" style={{ color: '#2C1810' }}>Aarambh</h2>
          <p className="text-xl font-semibold mb-2" style={{ color: '#4A3728' }}>जहाँ श्रद्धा मिले सेवा से</p>
          <p className="text-base mb-10" style={{ color: '#7A6350' }}>
            Join 15,000+ happy families. It only takes a few seconds to get started.
          </p>
          <Link href="/register" className="inline-block px-10 py-4 rounded-2xl text-lg font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)', boxShadow: '0 8px 32px rgba(212,101,30,0.2)' }}>
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="py-12 px-6" style={{ background: '#2C1810' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AarambhLogo size={28} showText={false} />
                <span className="font-bold" style={{ color: '#F5F0EB' }}>Aarambh</span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                जहाँ श्रद्धा मिले सेवा से
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
                India&apos;s trusted platform for booking verified pandits.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Services</h4>
              {['Wedding', 'Griha Pravesh', 'Satyanarayan', 'All Services'].map((s, i) => (
                <Link key={i} href="/services" className="block text-sm py-1 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.35)' }}>{s}</Link>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Company</h4>
              {['About', 'How It Works', 'For Pandits', 'Contact'].map((s, i) => (
                <Link key={i} href="/" className="block text-sm py-1 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.35)' }}>{s}</Link>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Legal</h4>
              {['Privacy Policy', 'Terms', 'Refund Policy'].map((s, i) => (
                <Link key={i} href="/" className="block text-sm py-1 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.35)' }}>{s}</Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2026 Aarambh. All rights reserved.</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Made with ❤️ in Indore, India</span>
          </div>
        </div>
      </footer>
    </div>
  )
}