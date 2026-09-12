// Real, authentic, pixel-perfect vector SVG logos and badges

export function WavelengthLogo({ size = 32, glowing = true, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`wavelength-brand-logo ${glowing ? 'logo-glow' : ''} ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id="wv-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="wv-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="wv-glow-filter" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Outer Holographic Glass Disc */}
      <circle cx="50" cy="50" r="46" fill="rgba(15, 17, 28, 0.7)" stroke="url(#wv-grad-1)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
      
      {/* Sonic Spectrum Waves forming the iconic 'W' */}
      <g filter="url(#wv-glow-filter)">
        {/* Wave Bar 1 */}
        <rect x="22" y="38" width="6" height="24" rx="3" fill="url(#wv-grad-2)" />
        {/* Wave Bar 2 */}
        <rect x="33" y="24" width="6" height="52" rx="3" fill="url(#wv-grad-1)" />
        {/* Center Wave Bar 3 */}
        <rect x="44" y="32" width="6" height="36" rx="3" fill="url(#wv-grad-2)" />
        {/* Wave Bar 4 */}
        <rect x="55" y="18" width="6" height="64" rx="3" fill="url(#wv-grad-1)" />
        {/* Wave Bar 5 */}
        <rect x="66" y="30" width="6" height="40" rx="3" fill="url(#wv-grad-2)" />
        {/* Wave Bar 6 */}
        <rect x="77" y="42" width="6" height="16" rx="3" fill="url(#wv-grad-1)" />
      </g>

      {/* Floating Sonic Orbit Particles */}
      <circle cx="25" cy="28" r="2" fill="#00f0ff" />
      <circle cx="75" cy="24" r="2.5" fill="#ec4899" />
      <circle cx="50" cy="84" r="2" fill="#a855f7" />
    </svg>
  )
}

export function GoogleLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.28 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.24a11.98 11.98 0 0 0 0 10.84l4.04-3.15z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function AppleLogo({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 170 170" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12.01-14.42-7.5-11.41-13.26-23.75-17.29-37.01-4.03-13.26-6.05-25.29-6.05-36.08 0-14.67 3.73-26.69 11.19-36.08 7.46-9.39 16.89-14.19 28.29-14.42 5.01 0 10.58 1.34 16.71 4.02 6.13 2.68 9.94 4.09 11.43 4.23 2.01-.36 6.03-1.87 12.06-4.54 6.03-2.67 11.45-3.88 16.27-3.64 12.56.67 22.51 5.34 29.85 14.02-11.02 6.69-16.39 15.86-16.12 27.53.27 9.07 3.72 16.69 10.36 22.86 6.64 6.17 14.4 9.69 23.28 10.56-2.14 6.69-4.82 13.57-8.03 20.64zM119.22 33.15c0-7.39 2.68-14.54 8.04-21.46 5.36-6.92 12.01-11.16 19.95-12.72.36 1.7.54 3.39.54 5.09 0 7.39-2.77 14.63-8.31 21.73-5.54 7.09-12.19 11.16-19.95 12.2-.09-1.61-.27-3.22-.27-4.84z" />
    </svg>
  )
}

export function GooglePlayLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gp-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c0fd" />
          <stop offset="100%" stopColor="#0061e0" />
        </linearGradient>
        <linearGradient id="gp-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff3a44" />
          <stop offset="100%" stopColor="#c31162" />
        </linearGradient>
        <linearGradient id="gp-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe000" />
          <stop offset="100%" stopColor="#ffbd00" />
        </linearGradient>
        <linearGradient id="gp-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e676" />
          <stop offset="100%" stopColor="#00a84e" />
        </linearGradient>
      </defs>
      <path
        d="M48.7 21.6C44.7 25.8 42.4 32.2 42.4 40.5v431c0 8.3 2.3 14.7 6.3 18.9l1.1 1.1 241.4-241.4v-5.7L49.8 20.5l-1.1 1.1z"
        fill="url(#gp-blue)"
      />
      <path
        d="M371.8 326.6l-80.6-80.6v-5.7l80.6-80.6 1.8 1 95.5 54.3c27.3 15.5 27.3 40.9 0 56.4l-95.5 54.2-1.8 1z"
        fill="url(#gp-yellow)"
      />
      <path
        d="M373.6 325.6L291.2 243.2 48.7 485.7c9 9.5 23.8 10.7 40.3 1.3l284.6-161.4z"
        fill="url(#gp-red)"
      />
      <path
        d="M373.6 186.4L89 25C72.5 15.6 57.7 16.8 48.7 26.3l242.5 242.5 82.4-82.4z"
        fill="url(#gp-green)"
      />
    </svg>
  )
}

export function SpotifyLogo({ size = 24, color = '#1ED760' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.306a.75.75 0 0 1-1.03.248c-2.823-1.724-6.377-2.114-10.562-1.158a.75.75 0 1 1-.334-1.462c4.58-1.045 8.52-.6 11.678 1.342a.75.75 0 0 1 .248 1.03zm1.468-3.26a.938.938 0 0 1-1.29.31c-3.232-1.986-8.158-2.56-11.982-1.4a.938.938 0 1 1-.546-1.794c4.372-1.328 9.792-.686 13.508 1.594a.938.938 0 0 1 .31 1.29zm.126-3.398c-3.876-2.302-10.27-2.514-13.98-1.388a1.125 1.125 0 1 1-.652-2.154c4.256-1.292 11.312-1.044 15.776 1.606a1.125 1.125 0 0 1-1.144 1.936z"
        fill={color}
      />
    </svg>
  )
}

export function AppleMusicLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="am-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fa233b" />
          <stop offset="50%" stopColor="#fb5c74" />
          <stop offset="100%" stopColor="#fa243c" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="115" fill="url(#am-grad)" />
      <path
        d="M346.5 129.8v169.3c0 23.3-19.1 42.4-42.4 42.4-23.4 0-42.5-19.1-42.5-42.4 0-23.4 19.1-42.5 42.5-42.5 8.1 0 15.6 2.3 22 6.3V184l-114 26.6v131c0 23.3-19.1 42.4-42.4 42.4s-42.5-19.1-42.5-42.4c0-23.4 19.1-42.5 42.5-42.5 8.1 0 15.6 2.3 22 6.3V185.3c0-10.8 7.9-19.9 18.6-21.6l121.2-28.3c7.2-1.7 14.5 3.7 14.5 11.1v-16.7z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function TidalLogo({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M4.004 7.996L0 12l4.004 4.004L8.008 12 4.004 7.996zm7.996 0L8 12l4 4.004L16 12l-3.996-4.004zm0-7.996L8 4.004 12 8.008 16 4.004 12 0zm8.004 7.996L16.004 12l4 4.004L24 12l-3.996-4.004z" />
    </svg>
  )
}

export function SoundCloudLogo({ size = 24, color = '#FF5500' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M1.16 13.72c-.08 0-.16-.07-.16-.16v-2.31c0-.09.08-.16.16-.16s.16.07.16.16v2.31c0 .09-.08.16-.16.16zm1.32.74c-.08 0-.16-.07-.16-.16v-3.79c0-.09.08-.16.16-.16s.16.07.16.16v3.79c0 .09-.08.16-.16.16zm1.32.26c-.08 0-.16-.07-.16-.16V9.45c0-.09.08-.16.16-.16s.16.07.16.16v5.11c0 .09-.08.16-.16.16zm1.32.22c-.08 0-.16-.07-.16-.16V8.65c0-.09.08-.16.16-.16s.16.07.16.16v6.29c0 .09-.08.16-.16.16zm1.32.18c-.08 0-.16-.07-.16-.16V8.33c0-.09.08-.16.16-.16s.16.07.16.16v6.79c0 .09-.08.16-.16.16zm1.32-.01c-.08 0-.16-.07-.16-.16V8.2c0-.09.08-.16.16-.16s.16.07.16.16v6.95c0 .09-.08.16-.16.16zm1.32.06c-.08 0-.16-.07-.16-.16V8.45c0-.09.08-.16.16-.16s.16.07.16.16v6.71c0 .09-.08.16-.16.16zm1.32-.04c-.08 0-.16-.07-.16-.16V9.01c0-.09.08-.16.16-.16s.16.07.16.16v5.87c0 .09-.08.16-.16.16zm2.74-7.51c-.48 0-.94.12-1.35.34v7.33h7.24c1.94 0 3.52-1.58 3.52-3.52 0-1.86-1.46-3.38-3.3-3.51-.23-2.12-2.02-3.77-4.11-3.77-.45 0-.89.07-1.3.2a4.43 4.43 0 0 0-3.7-2.07z" />
    </svg>
  )
}

export function DolbyAtmosLogo({ height = 16, color = '#FFFFFF' }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color,
        fontWeight: 800,
        letterSpacing: '0.08em',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
      }}
    >
      <svg width={height * 1.5} height={height} viewBox="0 0 38 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h6.8c6.6 0 12 5.4 12 12s-5.4 12-12 12H0V0zm6.8 19.2c4 0 7.2-3.2 7.2-7.2s-3.2-7.2-7.2-7.2H4.8v14.4h2z" />
        <path d="M38 0h-6.8c-6.6 0-12 5.4-12 12s5.4 12 12 12h6.8V0zm-6.8 19.2c-4 0-7.2-3.2-7.2-7.2s3.2-7.2 7.2-7.2h2v14.4h-2z" />
      </svg>
      <span style={{ fontSize: `${height * 0.75}px`, textTransform: 'uppercase' }}>DOLBY ATMOS</span>
    </div>
  )
}

export function HiResAudioLogo({ size = 32 }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        border: '1.5px solid #d4af37',
        borderRadius: '4px',
        padding: '3px 7px',
        color: '#f3cf55',
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1,
        boxShadow: '0 0 12px rgba(212, 175, 55, 0.3)',
      }}
      title="Hi-Res 24-Bit Studio Master Audio Certified"
    >
      <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.12em', color: '#fcd34d' }}>Hi-Res</span>
      <span style={{ fontSize: '7px', fontWeight: 700, letterSpacing: '0.2em', marginTop: '2px', color: '#ffffff' }}>AUDIO</span>
    </div>
  )
}

export function Spatial360Logo({ size = 24 }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(139, 92, 246, 0.15))',
        border: '1px solid rgba(0, 240, 255, 0.4)',
        borderRadius: '999px',
        padding: '4px 10px',
        color: '#00f0ff',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.06em',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
      <span>SPATIAL 360°</span>
    </div>
  )
}

export function FlacLosslessBadge({ rate = '24-Bit / 192kHz' }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        borderRadius: '6px',
        padding: '3px 8px',
        color: '#e9d5ff',
        fontSize: '10px',
        fontWeight: 800,
        letterSpacing: '0.08em',
        boxShadow: '0 0 10px rgba(168, 85, 247, 0.25)',
      }}
    >
      <span style={{ color: '#00f0ff' }}>●</span>
      <span>FLAC LOSSLESS</span>
      <span style={{ opacity: 0.7, fontWeight: 500 }}>({rate})</span>
    </div>
  )
}

export function DiscordLogo({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export function GithubLogo({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export function TwitterXLogo({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
