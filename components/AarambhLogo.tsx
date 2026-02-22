export default function AarambhLogo({ size = 36, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ width: size, height: size }} className="flex-shrink-0">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="24" cy="38" rx="14" ry="5" fill="#D4651E" opacity="0.12"/>
          <path d="M24 18 C20 24 14 30 10 34 C16 36 20 34 24 30 C28 34 32 36 38 34 C34 30 28 24 24 18Z" fill="#D4651E" opacity="0.15"/>
          <path d="M24 20 C18 22 12 28 8 32 C12 33 16 31 20 27 C22 29 23 30 24 30" fill="#E88030" opacity="0.2"/>
          <path d="M24 20 C30 22 36 28 40 32 C36 33 32 31 28 27 C26 29 25 30 24 30" fill="#E88030" opacity="0.2"/>
          <path d="M24 8 C22 12 19 16 19 20 C19 23 21 26 24 26 C27 26 29 23 29 20 C29 16 26 12 24 8Z" fill="url(#flameG)"/>
          <path d="M24 12 C23 14 21.5 17 21.5 19.5 C21.5 21.5 22.5 23 24 23 C25.5 23 26.5 21.5 26.5 19.5 C26.5 17 25 14 24 12Z" fill="#FFC857" opacity="0.8"/>
          <ellipse cx="24" cy="26" rx="5.5" ry="2" fill="#D4651E"/>
          <ellipse cx="24" cy="26" rx="4" ry="1.2" fill="#E88030"/>
          <circle cx="15" cy="31" r="1" fill="#D4651E" opacity="0.3"/>
          <circle cx="33" cy="31" r="1" fill="#D4651E" opacity="0.3"/>
          <defs>
            <linearGradient id="flameG" x1="24" y1="8" x2="24" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF8C00"/>
              <stop offset="40%" stopColor="#E8732A"/>
              <stop offset="100%" stopColor="#D4651E"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-extrabold tracking-tight" style={{ color: '#2C1810', letterSpacing: '-0.3px' }}>Aarambh</span>
          <span className="text-[8px] font-medium tracking-wider" style={{ color: '#B09980' }}>शुभ आरम्भ</span>
        </div>
      )}
    </div>
  )
}