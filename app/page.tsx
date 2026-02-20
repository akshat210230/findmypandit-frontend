'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const SERVICES = [
  { name: 'Wedding Ceremony', hindi: 'विवाह संस्कार', icon: '💍', desc: 'Complete Hindu wedding rituals with Vedic mantras' },
  { name: 'Griha Pravesh', hindi: 'गृह प्रवेश', icon: '🏠', desc: 'Housewarming puja for your new home' },
  { name: 'Satyanarayan Katha', hindi: 'सत्यनारायण कथा', icon: '📿', desc: 'Devotional worship of Lord Vishnu' },
  { name: 'Ganesh Puja', hindi: 'गणेश पूजा', icon: '🙏', desc: 'Invoke blessings of Lord Ganesha' },
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
  { name: 'Priya Mehta', city: 'Mumbai', text: 'Found the perfect pandit for my daughter\'s wedding. The Choghadiya feature helped us pick the most auspicious time!', rating: 5 },
  { name: 'Rajesh Kumar', city: 'Delhi', text: 'Booked a Griha Pravesh puja for our new home. Panditji was punctual and made everything special.', rating: 5 },
  { name: 'Sneha Patel', city: 'Bangalore', text: 'As someone new to the city, finding a trusted pandit felt impossible. This app changed everything.', rating: 5 },
]

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0C0A09' }}>

      {/* ═══════════════════════════════════════════
          HERO — Full viewport, spiritual imagery
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Warm gradient orbs */}
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(232,115,42,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,160,48,0.06) 0%, transparent 70%)' }} />

          {/* Spiritual image — Om/mandala with transparency */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
            <svg viewBox="0 0 400 400" className="w-[600px] h-[600px]" fill="none" stroke="rgba(232,115,42,1)" strokeWidth="0.5">
              <circle cx="200" cy="200" r="180" />
              <circle cx="200" cy="200" r="150" />
              <circle cx="200" cy="200" r="120" />
              <circle cx="200" cy="200" r="90" />
              <circle cx="200" cy="200" r="60" />
              {/* Lotus petals */}
              {[...Array(12)].map((_, i) => (
                <ellipse key={i} cx="200" cy="80" rx="25" ry="60"
                  transform={`rotate(${i * 30} 200 200)`} />
              ))}
            </svg>
          </div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(232,115,42,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,115,42,0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ background: 'rgba(232,115,42,0.08)', border: '1px solid rgba(232,115,42,0.15)' }}>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium" style={{ color: '#A89E93' }}>Trusted by 15,000+ families across India</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight">
              <span style={{ color: '#F5F0EB' }}>One app for all your</span>
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #E8732A, #D4A030)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>sacred ceremonies</span>
            </h1>

            <p className="text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: '#8B7A6B' }}>
              Book verified pandits for weddings, pujas & all Hindu ceremonies.
              Transparent pricing. Auspicious timing. Instant booking.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/search"
                className="group px-8 py-4 rounded-2xl text-lg font-bold text-white relative overflow-hidden transition-all hover:-translate-y-0.5"
                style={{ background: '#E8732A', boxShadow: '0 8px 32px rgba(232,115,42,0.25)' }}>
                <span className="relative z-10">Find a Pandit</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
              <Link href="/services"
                className="px-8 py-4 rounded-2xl text-lg font-medium transition-all hover:-translate-y-0.5"
                style={{ color: '#A89E93', border: '1.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                Explore Services →
              </Link>
            </div>

            {/* Stats row — Jeton style */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { val: '15,000+', label: 'Pujas Completed' },
                { val: '500+', label: 'Verified Pandits' },
                { val: '50+', label: 'Cities' },
                { val: '4.8★', label: 'Average Rating' },
              ].map((s, i) => (
                <div key={i} className="text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#E8732A' }}>{s.val}</div>
                  <div className="text-xs font-medium" style={{ color: '#6B6158' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs font-medium" style={{ color: '#6B6158' }}>Scroll</span>
            <div className="w-5 h-8 rounded-full border border-[rgba(255,255,255,0.1)] flex justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-[#E8732A] animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Numbered steps
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-[3px] uppercase mb-4 block" style={{ color: '#E8732A' }}>Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#F5F0EB' }}>
              Book a pandit in 4 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <div key={i} className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#1C1916', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-extrabold" style={{ color: 'rgba(232,115,42,0.15)' }}>{step.num}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#F5F0EB' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8B7A6B' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES — Card grid with glow
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        {/* Subtle glow behind section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(232,115,42,0.04) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold tracking-[3px] uppercase mb-4 block" style={{ color: '#E8732A' }}>Ceremonies</span>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#F5F0EB' }}>
                Sacred services we offer
              </h2>
            </div>
            <Link href="/services" className="hidden sm:block text-sm font-semibold hover:-translate-y-0.5 transition-all"
              style={{ color: '#E8732A' }}>
              View all 15+ →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => (
              <Link href="/services" key={i}
                className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ background: '#1C1916', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#F5F0EB' }}>{s.name}</h3>
                <p className="text-xs mb-3 font-medium" style={{ color: '#6B6158' }}>{s.hindi}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#8B7A6B' }}>{s.desc}</p>
                <div className="mt-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#E8732A' }}>
                  Book now →
                </div>
              </Link>
            ))}
          </div>

          <Link href="/services" className="sm:hidden block text-center mt-8 text-sm font-semibold" style={{ color: '#E8732A' }}>
            View all 15+ services →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CHOGHADIYA FEATURE — Highlight section
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(232,115,42,0.03) 0%, transparent 50%, rgba(232,115,42,0.03) 100%)' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold tracking-[3px] uppercase mb-4 block" style={{ color: '#E8732A' }}>Unique Feature</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: '#F5F0EB' }}>
                Book at the most<br />
                <span style={{ color: '#E8732A' }}>auspicious time</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#8B7A6B' }}>
                Our built-in Choghadiya calculator shows you the most auspicious time slots
                for your ceremony based on Vedic astrology. No more guessing — book with confidence
                knowing your ceremony starts at the perfect muhurat.
              </p>
              <div className="space-y-3">
                {['Amrit, Shubh & Labh periods highlighted', 'Rog, Kaal & Udveg periods marked to avoid', 'Updates automatically for every date'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}>✓</div>
                    <span className="text-sm" style={{ color: '#A89E93' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Choghadiya preview card */}
            <div className="p-6 rounded-2xl" style={{ background: '#1C1916', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">🕉️</span>
                <span className="font-bold" style={{ color: '#F5F0EB' }}>Din ka Choghadiya</span>
                <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(232,115,42,0.1)', color: '#E8732A' }}>
                  Sat, 22 Feb
                </span>
              </div>
              {[
                { name: 'Amrit', time: '6:00–7:30 AM', type: 'best', color: '#4ADE80' },
                { name: 'Shubh', time: '7:30–9:00 AM', type: 'good', color: '#22c55e' },
                { name: 'Rog', time: '9:00–10:30 AM', type: 'bad', color: '#F87171' },
                { name: 'Labh', time: '10:30–12:00 PM', type: 'good', color: '#84cc16' },
                { name: 'Kaal', time: '12:00–1:30 PM', type: 'bad', color: '#F87171' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl mb-2 transition-all"
                  style={{
                    background: s.type === 'bad' ? 'rgba(248,113,113,0.04)' : i === 0 ? 'rgba(232,115,42,0.08)' : 'rgba(255,255,255,0.02)',
                    border: i === 0 ? '1px solid rgba(232,115,42,0.2)' : '1px solid transparent',
                    opacity: s.type === 'bad' ? 0.4 : 1,
                  }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="font-semibold text-sm flex-1" style={{ color: '#F5F0EB' }}>{s.name}</span>
                  <span className="text-xs" style={{ color: '#6B6158' }}>{s.time}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: s.type === 'bad' ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)',
                      color: s.type === 'bad' ? '#F87171' : '#4ADE80'
                    }}>
                    {s.type === 'best' ? 'BEST' : s.type === 'good' ? 'GOOD' : 'AVOID'}
                  </span>
                </div>
              ))}
              <Link href="/search" className="block w-full mt-4 py-3 rounded-xl text-center font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: '#E8732A', boxShadow: '0 4px 20px rgba(232,115,42,0.2)' }}>
                Try it Now — Book a Pandit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold tracking-[3px] uppercase mb-4 block" style={{ color: '#E8732A' }}>Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#F5F0EB' }}>
              Hear from our families
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="p-6 rounded-2xl" style={{ background: '#1C1916', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <span key={j} style={{ color: '#FBBF24', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#A89E93' }}>"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #E8732A, #D4A030)' }}>
                    {r.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#F5F0EB' }}>{r.name}</div>
                    <div className="text-xs" style={{ color: '#6B6158' }}>{r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Final section
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(232,115,42,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-5" style={{ color: '#F5F0EB' }}>
            All your ceremonies,<br />in one app.
          </h2>
          <p className="text-lg mb-10" style={{ color: '#8B7A6B' }}>
            Join 15,000+ happy families. It only takes a few seconds to get started.
          </p>
          <Link href="/register"
            className="inline-block px-10 py-4 rounded-2xl text-lg font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: '#E8732A', boxShadow: '0 8px 32px rgba(232,115,42,0.25)' }}>
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="py-12 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: 'linear-gradient(135deg, #E8732A, #D4A030)' }}>🙏</div>
                <span className="font-bold" style={{ color: '#F5F0EB' }}>Find My Pandit</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#6B6158' }}>
                India&apos;s most trusted platform for booking verified pandits.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A89E93' }}>Services</h4>
              {['Wedding', 'Griha Pravesh', 'Satyanarayan', 'All Services'].map((s, i) => (
                <Link key={i} href="/services" className="block text-sm py-1 transition-colors" style={{ color: '#6B6158' }}>
                  {s}
                </Link>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A89E93' }}>Company</h4>
              {['About', 'How It Works', 'For Pandits', 'Contact'].map((s, i) => (
                <Link key={i} href="/" className="block text-sm py-1 transition-colors" style={{ color: '#6B6158' }}>
                  {s}
                </Link>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A89E93' }}>Legal</h4>
              {['Privacy Policy', 'Terms', 'Refund Policy'].map((s, i) => (
                <Link key={i} href="/" className="block text-sm py-1 transition-colors" style={{ color: '#6B6158' }}>
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-xs" style={{ color: '#6B6158' }}>© 2026 Find My Pandit. All rights reserved.</span>
            <span className="text-xs" style={{ color: '#6B6158' }}>Made with ❤️ in Indore, India</span>
          </div>
        </div>
      </footer>
    </div>
  )
}