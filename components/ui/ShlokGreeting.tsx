'use client'
import { useEffect, useRef, useState } from 'react'
import AarambhLogo from '@/components/AarambhLogo'

interface ShlokGreetingProps {
  role: string
  redirectPath: string
  onComplete: () => void
}

interface ShlokContent {
  title: string
  titleRoman: string
  shlok: string
  translation: string
  subtitle: string
}

const CONTENT: Record<string, ShlokContent> = {
  PANDIT: {
    title: 'नमस्कारम्',
    titleRoman: 'Namaskaram',
    shlok: 'यज्ञो दानं तपश्चैव पावनानि मनीषिणाम्।',
    translation: 'Sacrifice, charity and penance are the purifiers of the wise.',
    subtitle: 'Welcome, Panditji. Your service is sacred.',
  },
  DEFAULT: {
    title: 'स्वागतम्',
    titleRoman: 'Swagatam',
    shlok: 'सर्वे भवन्तु सुखिनः। सर्वे सन्तु निरामयाः।',
    translation: 'May all beings be happy. May all be free from illness.',
    subtitle: 'Welcome to Aarambh. Your sacred journey begins.',
  },
}

type Phase = 'entering' | 'visible' | 'exiting'

const DISPLAY_DURATION = 4000

export default function ShlokGreeting({ role, redirectPath, onComplete }: ShlokGreetingProps) {
  const [phase, setPhase] = useState<Phase>('entering')
  const [progress, setProgress] = useState(100)

  // Guards against React StrictMode double-invoke and duplicate shows
  const hasInitialized = useRef(false)
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  // Keep latest onComplete in a ref so the effect closure is stable
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const content = CONTENT[role] ?? CONTENT.DEFAULT

  const dismiss = () => {
    if (phase === 'exiting') return
    if (autoTimer.current) clearTimeout(autoTimer.current)
    if (progressInterval.current) clearInterval(progressInterval.current)
    setProgress(0)
    setPhase('exiting')
    setTimeout(() => onCompleteRef.current(), 400)
  }

  useEffect(() => {
    // Strict-mode guard: only run once per mount
    if (hasInitialized.current) return
    hasInitialized.current = true

    // Transition entering → visible after entrance animation completes
    const enterTimer = setTimeout(() => setPhase('visible'), 500)

    // Countdown progress bar (updates every 50ms)
    const startTime = Date.now()
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.max(0, 100 - (elapsed / DISPLAY_DURATION) * 100)
      setProgress(pct)
    }, 50)

    // Auto-dismiss after DISPLAY_DURATION
    autoTimer.current = setTimeout(() => {
      if (progressInterval.current) clearInterval(progressInterval.current)
      setProgress(0)
      setPhase('exiting')
      setTimeout(() => onCompleteRef.current(), 400)
    }, DISPLAY_DURATION)

    return () => {
      clearTimeout(enterTimer)
      if (autoTimer.current) clearTimeout(autoTimer.current)
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, []) // intentionally empty — runs once on mount

  const isEntering = phase === 'entering'
  const isExiting = phase === 'exiting'

  const overlayOpacity = isEntering ? 0 : isExiting ? 0 : 1
  const cardScale = isEntering ? 0.8 : isExiting ? 1.05 : 1
  const cardOpacity = isEntering ? 0 : isExiting ? 0 : 1
  const cardTransition = isEntering
    ? 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease'
    : 'transform 0.4s cubic-bezier(0.4,0,1,1), opacity 0.4s ease'

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(44,24,16,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '24px',
        opacity: overlayOpacity,
        transition: isEntering ? 'opacity 0.4s ease' : 'opacity 0.4s ease',
      }}
    >
      {/* Card — click does NOT stop propagation so entire screen is dismissable */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          background: 'var(--card-light-solid)',
          borderRadius: 28,
          padding: '48px 40px 32px',
          border: '1px solid var(--card-border)',
          boxShadow:
            '0 32px 80px rgba(44,24,16,0.45), 0 0 0 1px var(--accent-border), inset 0 1px 0 rgba(255,248,235,0.9)',
          textAlign: 'center',
          overflow: 'hidden',
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          transition: cardTransition,
        }}
      >
        {/* Inner ornate border line */}
        <div
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: 22,
            border: '1px solid var(--card-border)',
            pointerEvents: 'none',
          }}
        />

        {/* Corner ornaments */}
        {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => {
          const isTop = corner.includes('top')
          const isLeft = corner.includes('left')
          return (
            <div
              key={corner}
              style={{
                position: 'absolute',
                top: isTop ? 18 : undefined,
                bottom: isTop ? undefined : 18,
                left: isLeft ? 18 : undefined,
                right: isLeft ? undefined : 18,
                width: 20,
                height: 20,
                borderTop: isTop ? '1.5px solid var(--accent-border)' : undefined,
                borderBottom: isTop ? undefined : '1.5px solid var(--accent-border)',
                borderLeft: isLeft ? '1.5px solid var(--accent-border)' : undefined,
                borderRight: isLeft ? undefined : '1.5px solid var(--accent-border)',
                borderTopLeftRadius: corner === 'top-left' ? 6 : undefined,
                borderTopRightRadius: corner === 'top-right' ? 6 : undefined,
                borderBottomLeftRadius: corner === 'bottom-left' ? 6 : undefined,
                borderBottomRightRadius: corner === 'bottom-right' ? 6 : undefined,
                pointerEvents: 'none',
              }}
            />
          )
        })}

        {/* Background OM watermark */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '16rem',
            color: 'var(--accent-bg)',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          ॐ
        </div>

        {/* Diya logo */}
        <div
          className="animate-flicker"
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, position: 'relative' }}
        >
          <AarambhLogo size={56} showText={false} />
        </div>

        {/* Sanskrit title */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '3rem',
            fontWeight: 700,
            color: 'var(--text-on-light)',
            lineHeight: 1,
            marginBottom: 6,
            position: 'relative',
          }}
        >
          {content.title}
        </h1>

        {/* Roman transliteration */}
        <p
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '3.5px',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 28,
            position: 'relative',
          }}
        >
          {content.titleRoman}
        </p>

        {/* Ornamental divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            position: 'relative',
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: 'linear-gradient(to right, transparent, var(--card-border))',
            }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1rem',
              color: 'var(--gold-dim)',
            }}
          >
            ✦
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: 'linear-gradient(to left, transparent, var(--card-border))',
            }}
          />
        </div>

        {/* Shlok */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.55rem',
            fontStyle: 'italic',
            fontWeight: 500,
            color: 'var(--text-on-light)',
            lineHeight: 1.55,
            marginBottom: 14,
            position: 'relative',
          }}
        >
          {content.shlok}
        </p>

        {/* Translation */}
        <p
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.8rem',
            color: 'var(--text-on-light2)',
            lineHeight: 1.65,
            marginBottom: 22,
            fontStyle: 'italic',
            position: 'relative',
          }}
        >
          &ldquo;{content.translation}&rdquo;
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.88rem',
            fontWeight: 500,
            color: 'var(--text-on-light2)',
            marginBottom: 24,
            position: 'relative',
          }}
        >
          {content.subtitle}
        </p>

        {/* Dismiss hint */}
        <p
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.68rem',
            color: 'var(--text-on-light3)',
            marginBottom: 14,
            letterSpacing: '0.5px',
            position: 'relative',
          }}
        >
          Tap anywhere to continue
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: 3,
            background: 'var(--card-border)',
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-h))',
              borderRadius: 2,
              transition: 'width 0.05s linear',
            }}
          />
        </div>
      </div>
    </div>
  )
}
