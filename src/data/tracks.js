// Demo audio courtesy of SoundHelix (freely usable test tracks — swap these
// for your own library later). Album art is generated from a per-track hue
// rather than shipped as image files — see AlbumArt.jsx.

export const tracks = [
  {
    id: 't1',
    title: 'Low Tide',
    artist: 'Marina Colt',
    album: 'Shoreline Sessions',
    duration: 227,
    hue: 28, // brass / amber
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 't2',
    title: 'Static Bloom',
    artist: 'Fielding Grey',
    album: 'Antenna',
    duration: 265,
    hue: 168, // teal
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 't3',
    title: 'Nine Empty Rooms',
    artist: 'Marina Colt',
    album: 'Shoreline Sessions',
    duration: 198,
    hue: 340, // rose
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 't4',
    title: 'Copper Line',
    artist: 'The Slow Machine',
    album: 'Copper Line EP',
    duration: 241,
    hue: 22,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 't5',
    title: 'Night Ferry',
    artist: 'Fielding Grey',
    album: 'Antenna',
    duration: 253,
    hue: 205, // blue
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: 't6',
    title: 'Paper Weather',
    artist: 'Odessa Lune',
    album: 'Paper Weather',
    duration: 212,
    hue: 90, // olive
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
  {
    id: 't7',
    title: 'Radio Silence',
    artist: 'The Slow Machine',
    album: 'Copper Line EP',
    duration: 289,
    hue: 15,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  },
  {
    id: 't8',
    title: 'Amber Hour',
    artist: 'Odessa Lune',
    album: 'Paper Weather',
    duration: 233,
    hue: 40,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  }, 
  {
    id: 't9',
    title: 'Amber Hour',
    artist: 'Odessa Lune',
    album: 'Paper Weather',
    duration: 233,
    hue: 40,
    src: '/audio/Nikhilsoni.mp3',
  },
]

// Deterministic pseudo-random waveform bar heights, seeded per track so the
// same track always renders the same "waveform" without needing real audio
// analysis. Good enough for a seek-bar visual; swap for a real Web Audio
// AnalyserNode later if you want live analysis as a stretch goal.
export function waveformFor(trackId, bars = 64) {
  let seed = 0
  for (let i = 0; i < trackId.length; i++) seed = (seed * 31 + trackId.charCodeAt(i)) >>> 0
  const values = []
  for (let i = 0; i < bars; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0
    const base = (seed % 1000) / 1000
    // shape it so it feels more like a track (swell in the middle) than pure noise
    const envelope = 0.35 + 0.65 * Math.sin((Math.PI * i) / bars)
    values.push(0.15 + base * 0.85 * envelope)
  }
  return values
}
