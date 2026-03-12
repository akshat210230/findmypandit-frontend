'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ScrollExpandMediaProps {
  mediaType: 'image' | 'video'
  mediaSrc: string
  bgImageSrc?: string
  title: string
  scrollToExpand?: string
  textBlend?: boolean
}

export default function ScrollExpandMedia({
  mediaType,
  mediaSrc,
  title,
}: ScrollExpandMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  useEffect(() => {
    return scrollYProgress.on('change', v => setScrollProgress(v))
  }, [scrollYProgress])

  const borderRadius = useTransform(scrollYProgress, [0, 0.55], [22, 0])
  const mediaWidth   = useTransform(scrollYProgress, [0, 0.55], ['76%', '100%'])
  const mediaHeight  = useTransform(scrollYProgress, [0, 0.55], ['72vh', '100vh'])
  const titleY       = useTransform(scrollYProgress, [0, 0.32], ['0%', '-18%'])
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.38], [1, 0])

  return (
    <>
      <style>{`
        @keyframes goldShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
      `}</style>

      <section
        ref={containerRef}
        style={{ height: '300vh', position: 'relative' }}
      >
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a0502',
        }}>

          {/* Expanding media box */}
          <motion.div style={{
            width: mediaWidth,
            height: mediaHeight,
            borderRadius,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {mediaType === 'image' ? (
              <img
                src={mediaSrc}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <video
                src={mediaSrc}
                autoPlay muted loop playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}

            {/* Dark overlay */}
            <motion.div
              className="absolute inset-0 bg-black/40 rounded-xl"
              style={{ pointerEvents: 'none' }}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: Math.max(0, 0.5 - scrollProgress * 0.35) }}
            />

            {/* Title overlay */}
            <motion.div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              y: titleY,
              opacity: titleOpacity,
            }}>
              <div
                className="flex flex-col items-center justify-center text-center w-full relative z-10"
                style={{ transform: 'translateX(0)', padding: '0 20px' }}
              >
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 700,
                  fontSize: 'clamp(4rem, 9vw, 7.5rem)',
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
                  textShadow: 'none',
                }}>
                  Aarambh
                </span>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 400,
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                  letterSpacing: '0.06em',
                  color: 'rgba(255,240,200,0.65)',
                  display: 'block',
                }}>
                  जहाँ श्रद्धा मिले सेवा से
                </span>
                <p style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1rem',
                  color: 'rgba(255,240,200,0.65)',
                  lineHeight: 1.65,
                  maxWidth: 480,
                  margin: '20px auto 0',
                  textAlign: 'center',
                }}>
                  Connect with verified pandits for every ceremony.<br />
                  Guided by tradition, powered by trust.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 24, flexWrap: 'wrap', pointerEvents: 'all' }}>
                  <a href="/search" style={{
                    background: '#C84800', color: '#fff', borderRadius: 999,
                    padding: '13px 32px', fontSize: '0.95rem', fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif", textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(200,72,0,0.4)',
                    display: 'inline-block',
                  }}>Book a Pandit</a>
                  <a href="/services" style={{
                    background: 'transparent', color: 'rgba(255,240,200,0.8)',
                    border: '1.5px solid rgba(255,240,200,0.28)', borderRadius: 999,
                    padding: '12px 28px', fontSize: '0.92rem',
                    fontFamily: "'Outfit', sans-serif", textDecoration: 'none',
                    display: 'inline-block',
                  }}>Browse Ceremonies</a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <div style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: Math.max(0, 1 - scrollProgress * 8),
            zIndex: 20,
            pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: '0.62rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(224,160,32,0.55)',
              fontFamily: "'Outfit', sans-serif",
            }}>
              SCROLL TO ENTER
            </span>
            <div style={{
              width: 1,
              height: 36,
              background: 'linear-gradient(to bottom, transparent, rgba(224,160,32,0.5))',
              animation: 'scrollPulse 1.8s ease-in-out infinite',
            }} />
          </div>

        </div>
      </section>
    </>
  )
}
