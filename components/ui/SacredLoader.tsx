interface SacredLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CONFIG = {
  sm: {
    iconSize: '1.5rem',
    padding: '32px 0',
    fontSize: '0.75rem',
    gap: 8,
    fullScreen: false,
  },
  md: {
    iconSize: '2.5rem',
    padding: '48px 0',
    fontSize: '0.875rem',
    gap: 12,
    fullScreen: false,
  },
  lg: {
    iconSize: '4rem',
    padding: '0',
    fontSize: '1rem',
    gap: 16,
    fullScreen: true,
  },
}

export default function SacredLoader({ message = 'Loading...', size = 'md' }: SacredLoaderProps) {
  const cfg = SIZE_CONFIG[size]

  const inner = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: cfg.gap,
      padding: cfg.padding,
      textAlign: 'center',
    }}>
      <span className="animate-damru" style={{ fontSize: cfg.iconSize, lineHeight: 1 }}>
        🪘
      </span>
      {message && (
        <span style={{
          fontFamily: 'Outfit, system-ui, sans-serif',
          fontSize: cfg.fontSize,
          color: 'var(--text-3)',
          fontWeight: 300,
          letterSpacing: '0.3px',
        }}>
          {message}
        </span>
      )}
    </div>
  )

  if (cfg.fullScreen) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        {inner}
      </div>
    )
  }

  return inner
}
