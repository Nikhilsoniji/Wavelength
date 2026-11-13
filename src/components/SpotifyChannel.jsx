import { useState, useMemo, useCallback } from 'react'
import {
  ExternalLink,
  Check,
  Copy,
  Sparkles,
  Sliders,
  Volume2,
  ShieldCheck,
  Layers,
  Flame,
  Search,
  Zap,
  Share2,
  Headphones,
  Music,
  ArrowRight,
  Radio,
} from 'lucide-react'
import { SpotifyLogo } from './RealLogos'
import { haptics } from '../utils/haptics'
import { usePlayerStore } from '../store/usePlayerStore'

export const SPOTIFY_FLAGSHIP_CHANNELS = [
  {
    id: '37i9dQZF1DXcBWIGoYBM5M',
    type: 'playlist',
    name: "Today's Top Hits",
    category: 'Global Billboard',
    desc: 'The hottest tracks in the world right now. Lady Gaga, Bruno Mars, Sabrina Carpenter, Billie Eilish.',
    followers: '34M+ Followers',
    tag: '#1 GLOBAL',
    color: '#1DB954',
  },
  {
    id: '37i9dQZF1DX0XUsuxWHRQd',
    type: 'playlist',
    name: 'RapCaviar',
    category: 'Hip-Hop & Trap',
    desc: 'Heavyweight hip-hop anthems, trap bangers, and chart-topping street records.',
    followers: '15M+ Followers',
    tag: 'HIP-HOP TITANS',
    color: '#ff5500',
  },
  {
    id: '37i9dQZF1DX0XUfTFmZeMt',
    type: 'playlist',
    name: 'Bollywood Butter',
    category: 'Bollywood Chartbusters',
    desc: 'The essential Hindi film soundtrack: romantic chartbusters, viral party hits, and timeless melodies.',
    followers: '8M+ Followers',
    tag: 'DESI FIRE',
    color: '#f59e0b',
  },
  {
    id: '37i9dQZF1DX10zKzsJ2jva',
    type: 'playlist',
    name: 'Viva Latino',
    category: 'Latin & Reggaeton',
    desc: 'Today’s top Latin hits and sizzling reggaeton anthems driving dancefloors worldwide.',
    followers: '14M+ Followers',
    tag: 'LATIN HEAT',
    color: '#ec4899',
  },
  {
    id: '37i9dQZF1DX4dyzvuaRJ0n',
    type: 'playlist',
    name: 'Mint EDM & Dance',
    category: 'Electronic Festivals',
    desc: 'The world’s biggest dance tracks, mainstage festival bangers, and club heat.',
    followers: '6M+ Followers',
    tag: 'ELECTRO FEST',
    color: '#06b6d4',
  },
  {
    id: '37i9dQZF1DWZeKCadgRdKQ',
    type: 'playlist',
    name: 'Deep Focus',
    category: 'Ambient & Concentration',
    desc: 'Calm and focus with binaural beats, ambient soundscapes, and gentle lofi rhythms.',
    followers: '4.5M+ Followers',
    tag: 'FLOW STATE',
    color: '#8b5cf6',
  },
  {
    id: '37i9dQZF1DX5Ejj0EkURtP',
    type: 'playlist',
    name: 'All Out 2010s',
    category: 'Throwback Gold',
    desc: 'The biggest pop, dance, and rock anthems that defined the 2010s decade.',
    followers: '12M+ Followers',
    tag: 'NOSTALGIA',
    color: '#10b981',
  },
  {
    id: '37i9dQZF1DX76Wlfdnj7AP',
    type: 'playlist',
    name: 'Beast Mode',
    category: 'Workout & Energy',
    desc: 'Fast-paced, high-BPM power tracks engineered for maximum workout intensity.',
    followers: '10M+ Followers',
    tag: 'MAX HYPER',
    color: '#ef4444',
  },
  {
    id: '37i9dQZF1DX4sWSpwq3LiO',
    type: 'playlist',
    name: 'Peaceful Piano',
    category: 'Solo Piano & Calm',
    desc: 'Peaceful acoustic and neo-classical piano melodies for rest, reading, and meditation.',
    followers: '7M+ Followers',
    tag: 'PEACEFUL',
    color: '#38bdf8',
  },
  {
    id: '37i9dQZF1DX3uKNqqmeWvJ',
    type: 'playlist',
    name: 'Fresh Finds',
    category: 'Indie & Breakout',
    desc: 'Discover tomorrow’s breakthrough artists and independent music pioneers first.',
    followers: '1.2M+ Followers',
    tag: 'NEW DISCOVERY',
    color: '#a855f7',
  },
]

export function parseSpotifyUrl(url) {
  if (!url) return null
  const clean = url.trim()

  // URI format: spotify:playlist:37i9dQZF1DXcBWIGoYBM5M
  const uriMatch = clean.match(/spotify:(track|playlist|album|artist|show|episode):([a-zA-Z0-9]+)/i)
  if (uriMatch) {
    return { type: uriMatch[1].toLowerCase(), id: uriMatch[2] }
  }

  // Web URL format: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
  const webMatch = clean.match(/open\.spotify\.com\/(track|playlist|album|artist|show|episode)\/([a-zA-Z0-9]+)/i)
  if (webMatch) {
    return { type: webMatch[1].toLowerCase(), id: webMatch[2] }
  }

  // Fallback: If just a raw alphanumeric ID was passed
  if (/^[a-zA-Z0-9]{22}$/.test(clean)) {
    return { type: 'playlist', id: clean }
  }

  return null
}

export default function SpotifyChannel({ onBack }) {
  const [selectedChannel, setSelectedChannel] = useState(SPOTIFY_FLAGSHIP_CHANNELS[0])
  const [customInput, setCustomInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [audioBitrate, setAudioBitrate] = useState('320')
  const [eqPreset, setEqPreset] = useState('Extreme Bass 808')
  const [copiedLink, setCopiedLink] = useState(false)
  const [canvasEnabled, setCanvasEnabled] = useState(true)

  const pauseWavelengthAudio = usePlayerStore((s) => s.pause)
  const isWavelengthPlaying = usePlayerStore((s) => s.isPlaying)

  // Computed embed URL
  const embedUrl = useMemo(() => {
    const type = selectedChannel.type || 'playlist'
    const id = selectedChannel.id
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`
  }, [selectedChannel])

  // Handle channel select
  const handleSelectChannel = (channel) => {
    haptics.impact()
    if (isWavelengthPlaying) {
      pauseWavelengthAudio()
    }
    setSelectedChannel(channel)
    setInputError('')
  }

  // Handle custom URL submit
  const handleLoadCustomUrl = (e) => {
    e.preventDefault()
    if (!customInput.trim()) return

    const parsed = parseSpotifyUrl(customInput)
    if (parsed) {
      haptics.impact()
      if (isWavelengthPlaying) {
        pauseWavelengthAudio()
      }
      setSelectedChannel({
        id: parsed.id,
        type: parsed.type,
        name: `Custom ${parsed.type.toUpperCase()}`,
        category: 'Imported Stream',
        desc: `Loaded via direct Spotify ${parsed.type} link: ${parsed.id}`,
        followers: 'User Channel',
        tag: 'CUSTOM',
        color: '#1DB954',
      })
      setInputError('')
      setCustomInput('')
    } else {
      setInputError('Please enter a valid Spotify track, album, or playlist URL / URI.')
    }
  }

  // Copy share link
  const handleCopySpotifyLink = () => {
    haptics.impact()
    const link = `https://open.spotify.com/${selectedChannel.type || 'playlist'}/${selectedChannel.id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      })
    }
  }

  return (
    <div className={`spotify-channel-page ${canvasEnabled ? 'canvas-active' : ''}`}>
      {/* Background Ambient Canvas Glow */}
      <div
        className="spotify-ambient-canvas"
        style={{
          background: `radial-gradient(circle at 70% 20%, ${selectedChannel.color}28 0%, transparent 60%),
                      radial-gradient(circle at 20% 80%, rgba(29, 185, 84, 0.15) 0%, transparent 65%)`,
        }}
      />

      {/* Header Banner */}
      <header className="spotify-channel-header">
        <div className="spotify-header-left">
          <div className="spotify-premium-pill">
            <SpotifyLogo size={18} color="#1ED760" />
            <span className="pill-brand">SPOTIFY PREMIUM</span>
            <span className="pill-divider">•</span>
            <span className="pill-status">HI-FI CHANNEL</span>
            <span className="spotify-live-dot" />
          </div>

          <h1 className="spotify-header-title">Spotify Master Channel</h1>
          <p className="spotify-header-desc">
            Direct high-bitrate streaming from Spotify's flagship playlists. Connect your account,
            explore curated charts, and enjoy 320kbps extreme audio within Wavelength.
          </p>

          <div className="spotify-stat-tags">
            <div className="spotify-stat-tag">
              <ShieldCheck size={14} className="text-emerald" />
              <span>OFFICIAL EMBED ENGINE</span>
            </div>
            <div className="spotify-stat-tag">
              <Volume2 size={14} className="text-spotify" />
              <span>{audioBitrate} KBPS EXTREME QUALITY</span>
            </div>
            <div className="spotify-stat-tag">
              <Zap size={14} className="text-amber" />
              <span>CONNECT: WAVELENGTH LOSSLESS</span>
            </div>
          </div>
        </div>

        {/* Custom URL Import Box */}
        <div className="spotify-url-loader-card">
          <div className="loader-title-row">
            <Search size={14} className="text-spotify" />
            <span>LOAD ANY SPOTIFY LINK / URI</span>
          </div>
          <form onSubmit={handleLoadCustomUrl} className="spotify-input-form">
            <input
              type="text"
              placeholder="Paste open.spotify.com URL or spotify:playlist:..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="spotify-url-input"
            />
            <button type="submit" className="spotify-submit-btn" title="Load Spotify stream">
              <ArrowRight size={16} />
            </button>
          </form>
          {inputError && <span className="spotify-error-msg">{inputError}</span>}
          <div className="loader-hints">
            <span>Supports: Playlists • Albums • Tracks • Podcasts</span>
          </div>
        </div>
      </header>

      {/* Main Player Display Section */}
      <section className="spotify-player-main-section">
        <div className="spotify-active-header-bar">
          <div className="active-channel-meta">
            <div
              className="channel-color-bar"
              style={{ background: selectedChannel.color }}
            />
            <div>
              <div className="active-tag-row">
                <span className="active-channel-tag" style={{ color: selectedChannel.color }}>
                  {selectedChannel.tag}
                </span>
                <span className="active-channel-category">{selectedChannel.category}</span>
              </div>
              <h2 className="active-channel-title">{selectedChannel.name}</h2>
              <p className="active-channel-desc">{selectedChannel.desc}</p>
            </div>
          </div>

          <div className="spotify-player-actions">
            <a
              href={`https://open.spotify.com/${selectedChannel.type || 'playlist'}/${selectedChannel.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="spotify-action-btn"
              title="Open directly in Spotify Web or App"
            >
              <ExternalLink size={15} />
              <span>Open in Spotify</span>
            </a>

            <button
              className="spotify-action-btn"
              onClick={handleCopySpotifyLink}
              title="Copy direct Spotify link"
            >
              {copiedLink ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Embedded Spotify Player Iframe */}
        <div className="spotify-iframe-wrapper">
          <iframe
            src={embedUrl}
            width="100%"
            height="460"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={`Spotify Player - ${selectedChannel.name}`}
            className="spotify-embed-frame"
          />
        </div>
      </section>

      {/* Hi-Fi Audio Controls & Enhancer Bar */}
      <section className="spotify-audio-controls-card">
        <div className="audio-ctrl-col">
          <div className="ctrl-label-row">
            <Volume2 size={15} className="text-spotify" />
            <span>AUDIO STREAMING BITRATE</span>
          </div>
          <div className="ctrl-options-row">
            {[
              { id: '96', label: '96 kbps (Normal)' },
              { id: '160', label: '160 kbps (High)' },
              { id: '320', label: '320 kbps (Very High / Extreme)' },
            ].map((opt) => (
              <button
                key={opt.id}
                className={`ctrl-option-btn ${audioBitrate === opt.id ? 'active' : ''}`}
                onClick={() => {
                  haptics.impact()
                  setAudioBitrate(opt.id)
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="audio-ctrl-col">
          <div className="ctrl-label-row">
            <Sliders size={15} className="text-purple" />
            <span>HI-FI EQ PROFILE</span>
          </div>
          <div className="ctrl-options-row">
            {['Extreme Bass 808', 'Vocal Clarity', 'Spatial Immersion', 'Studio Flat'].map((preset) => (
              <button
                key={preset}
                className={`ctrl-option-btn ${eqPreset === preset ? 'active' : ''}`}
                onClick={() => {
                  haptics.impact()
                  setEqPreset(preset)
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="audio-ctrl-col audio-toggle-col">
          <div className="ctrl-label-row">
            <Sparkles size={15} className="text-cyan" />
            <span>SPOTIFY CANVAS VISUALIZER</span>
          </div>
          <button
            className={`canvas-toggle-btn ${canvasEnabled ? 'active' : ''}`}
            onClick={() => {
              haptics.impact()
              setCanvasEnabled((prev) => !prev)
            }}
          >
            {canvasEnabled ? 'Active (Dynamic)' : 'Disabled'}
          </button>
        </div>
      </section>

      {/* Flagship Channels Selector Grid */}
      <section className="spotify-channels-section">
        <div className="spotify-section-header">
          <div className="section-title-wrap">
            <Flame size={20} className="text-spotify" />
            <div>
              <h2 className="spotify-section-heading">Official Flagship Spotify Channels</h2>
              <p className="spotify-section-sub">
                Curated by Spotify editors. Select any flagship channel to stream instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="spotify-channel-cards-grid">
          {SPOTIFY_FLAGSHIP_CHANNELS.map((channel) => {
            const isSelected = selectedChannel.id === channel.id
            return (
              <div
                key={channel.id}
                className={`spotify-channel-card ${isSelected ? 'selected-channel' : ''}`}
                onClick={() => handleSelectChannel(channel)}
                style={{ '--channel-color': channel.color }}
              >
                <div className="channel-card-top">
                  <span className="channel-badge" style={{ color: channel.color }}>
                    {channel.tag}
                  </span>
                  <div className="channel-spotify-icon">
                    <SpotifyLogo size={18} color={channel.color} />
                  </div>
                </div>

                <div className="channel-card-body">
                  <h3 className="channel-card-name">{channel.name}</h3>
                  <div className="channel-card-cat">{channel.category}</div>
                  <p className="channel-card-desc">{channel.desc}</p>
                </div>

                <div className="channel-card-footer">
                  <span className="channel-followers">{channel.followers}</span>
                  <button
                    className="channel-stream-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectChannel(channel)
                    }}
                  >
                    <span>{isSelected ? 'Streaming' : 'Play Channel'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
