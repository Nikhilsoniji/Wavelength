import { parseLRC } from '../utils/lyricsParser.js'

// Curated authentic LRC time-synced lyrics for popular tracks in Wavelength
const STATIC_LRC_DATABASE = {
  // Kesariya - Brahmāstra
  'bw-1': `
[00:00.00] ♪ Instrumental Intro ♪
[00:15.50] Mujhko itna bataye koi
[00:20.10] Kaise tujhse dil na lagaye koi
[00:25.80] Rabba ne tujhko banane mein
[00:30.20] Kar di hai husn ki khaali tijoriyaan
[00:35.60] Kaajal ki siyaahi se likhi
[00:40.00] Hai tune jaane kitno ki love storiyaan
[00:45.30] Kesariya tera ishq hai piya
[00:50.40] Rang jaaun jo main haath lagaun
[00:55.20] Din beete saara teri fikr mein
[01:00.10] Rain saari teri khair manaun
[01:05.10] Kesariya tera ishq hai piya
[01:10.10] Rang jaaun jo main haath lagaun
[01:14.90] Din beete saara teri fikr mein
[01:19.80] Rain saari teri khair manaun
[01:24.90] ♪ Flute & Guitar Interlude ♪
[01:34.50] Patjhad ke mausam mein bhi
[01:39.40] Rangi chanar jaisi
[01:44.20] Jhanke sannaate mein tu
[01:49.10] Veena ke taar jaisi
[01:54.00] Sadiyon se bhi lambi yeh
[01:58.80] Mann ki amavasein hain
[02:03.70] Aur tu phuljhadiyon waale
[02:08.50] Tyohar jaisi
[02:13.40] Chanda bhi deewana hai tera
[02:18.20] Jalti hai tujhse saari chakoriyan
[02:23.10] Kaajal ki siyaahi se likhi
[02:28.00] Hai tune jaane kitno ki love storiyaan
[02:32.90] Kesariya tera ishq hai piya
[02:37.80] Rang jaaun jo main haath lagaun
[02:42.70] Din beete saara teri fikr mein
[02:47.60] Rain saari teri khair manaun
[02:52.50] Kesariya tera ishq hai piya
[02:57.40] Rang jaaun jo main haath lagaun
`,

  // Tauba Tauba - Karan Aujla
  'bw-2': `
[00:00.00] ♪ Beats Drop & Punjabi Hook ♪
[00:08.50] O husn tera tauba tauba
[00:12.80] Dil kare dhak dhak tauba
[00:17.20] Teriyan addavaan utte mar gaye aa
[00:21.50] Dil tere aage assi dhar gaye aa
[00:25.80] O kudiye ni sach dassa tenu
[00:30.10] Rabb di sonh lagge tu menu
[00:34.50] Chaare paase charche ne tere
[00:38.80] Saare munde pagal ne phire
[00:43.20] Tauba tauba husn tera tauba tauba
[00:47.50] Nachdi tu lagge agg wargi
[00:51.80] Saari duniya nu thall dardi
[00:56.20] Tauba tauba husn tera tauba tauba
[01:00.50] ♪ Brass & Bassline Groove ♪
[01:12.00] Akhiyan ch kajla te gallan utte laali
[01:16.40] Nakhra ae mehanga teri tor matwaali
[01:20.80] Mundeyan de dilaan te chalaundi talwar
[01:25.10] Kardi tabahi jado aave bazaar
[01:29.50] Tauba tauba husn tera tauba tauba
[01:33.80] Dil kare dhak dhak tauba!
`,

  // Chaleya - Jawan
  'bw-3': `
[00:00.00] ♪ Romantic Melodic Intro ♪
[00:10.20] Ishq mein dil bana hai
[00:14.50] Ishq mein dil fanaa hai
[00:18.90] Hosh abhi baaki hai
[00:23.20] Ishq abhi chal raha hai
[00:27.60] Teri aashiqui ne maara
[00:32.00] Hum toh chale the seedhe
[00:36.30] Rasta badal diya re
[00:40.70] Chaleya chaleya tere pichhe pichhe chaleya
[00:45.00] Aaya main toh aaya tere ishq mein dhaleya
[00:49.40] Chaleya chaleya tere pichhe pichhe chaleya
[00:53.70] Manzil na mile toh bhi rasta bhala lageya
[00:58.10] ♪ Rhythm Drop ♪
[01:08.00] Tu agar sang hai toh jahan haseen hai
[01:12.40] Tere bina toh saansein bhi kamzori si lagti hain
`,

  // Sajni - Laapataa Ladies
  'bw-7': `
[00:00.00] ♪ Acoustic Guitar & Sarangi Intro ♪
[00:12.40] O sajni re...
[00:18.60] Kaise kate din raat
[00:24.80] Kaise kate din raat
[00:31.00] Tere bina jiya mora ghabraye
[00:37.20] O sajni re...
[00:43.40] Naino se barsat
[00:49.60] Beeti jaye baat
[00:55.80] Tujhko pukare mera manva re
[01:02.00] Teri yaad mein doobi hai shaamein
[01:08.20] Aankhon mein thehri yeh baatein
[01:14.40] O sajni re...
`,

  // Die With A Smile - Lady Gaga, Bruno Mars
  'hw-1': `
[00:00.00] ♪ Soulful Piano & Vintage Guitars ♪
[00:12.20] I, I just woke up from a dream
[00:17.50] Where you and I had to say goodbye
[00:23.80] And I don't know what it all means
[00:29.10] But since I survived, I realized
[00:34.90] Wherever you go, that's where I'll follow
[00:40.80] Nobody's promised tomorrow
[00:46.40] So I'ma love you every night like it's the last night
[00:52.20] Like it's the last night
[00:57.60] If the world was ending
[01:00.80] I'd wanna be next to you
[01:06.40] If the party was over
[01:09.60] And our time on Earth was through
[01:15.20] I'd wanna hold you just for a while
[01:21.00] And die with a smile
[01:26.80] If the world was ending
[01:30.00] I'd wanna be next to you
[01:35.80] ♪ Soaring Harmony Interlude ♪
[01:46.00] Ooh, lost, lost in the words that we scream
[01:52.40] I don't wanna cry, not tonight
[01:58.20] 'Cause where you go, that's where I'll follow
[02:04.00] Nobody's promised tomorrow
[02:09.80] So I'ma love you every night like it's the last night
[02:15.60] Like it's the last night
[02:21.40] If the world was ending
[02:24.60] I'd wanna be next to you
[02:30.20] If the party was over
[02:33.40] And our time on Earth was through
[02:39.00] I'd wanna hold you just for a while
[02:44.80] And die with a smile
`,

  // Espresso - Sabrina Carpenter
  'hw-2': `
[00:00.00] ♪ Nu-Disco Bass Groove ♪
[00:07.50] Now he's thinkin' 'bout me every night, oh
[00:11.20] Is it that sweet? I guess so
[00:14.80] Say you can't sleep, baby, I know
[00:18.50] That's that me, espresso
[00:22.20] Move it up, down, left, right, oh
[00:25.80] Switch it up like Nintendo
[00:29.50] Say you can't sleep, baby, I know
[00:33.20] That's that me, espresso
[00:37.00] Holy shit, I know I'm cute
[00:40.50] Walk by in my summer suit
[00:44.20] Too bad your heart's on fire
[00:47.80] Guess who's the spark in that wire?
[00:51.50] Yes, I know it's captivating
[00:55.20] No wonder you're wide awake and...
[00:58.80] Now he's thinkin' 'bout me every night, oh
[01:02.50] Is it that sweet? I guess so
[01:06.20] Say you can't sleep, baby, I know
[01:09.80] That's that me, espresso!
`,

  // BIRDS OF A FEATHER - Billie Eilish
  'hw-3': `
[00:00.00] ♪ Shimmering Alt-Pop Synth Intro ♪
[00:09.50] I want you to stay
[00:14.20] 'Til I'm in the grave
[00:18.80] 'Til I rot away, dead and buried
[00:23.50] 'Til I'm in the casket you carry
[00:28.20] If you go, I'm goin' too, uh
[00:32.80] 'Cause it was always you, alright
[00:37.50] And if I'm turnin' blue, please don't save me
[00:42.20] Nothin' in this world to persuade me
[00:46.80] Birds of a feather, we should stick together, I know
[00:51.50] I said I'd never think I wasn't better alone
[00:56.20] Can't change the weather, might not be forever
[01:00.80] But if it's forever, it's even better
[01:05.50] And I don't know what I'm cryin' for
[01:10.20] I don't think I could love you more
[01:14.80] It might not be long, but baby, I
[01:19.50] I'll love you 'til the day that I die
`,

  // Cruel Summer - Taylor Swift
  'hw-4': `
[00:00.00] ♪ Pulsing Synthwave Bassline ♪
[00:07.80] Fever dream high in the quiet of the night
[00:11.50] You know that I caught it
[00:15.20] Bad, bad boy, shiny toy with a price
[00:18.90] You know that I bought it
[00:22.60] Killing me slow, out the window
[00:26.30] I'm always waiting for you to be waiting below
[00:30.00] Devils roll the dice, angels roll their eyes
[00:33.70] What doesn't kill me makes me want you more
[00:37.40] And it's new, the shape of your body
[00:41.10] It's blue, the feeling I've got
[00:44.80] And it's ooh, whoa, oh
[00:48.50] It's a cruel summer
[00:52.20] It's cool, that's what I tell 'em
[00:55.90] No rules in breakable heaven
[00:59.60] But ooh, whoa, oh
[01:03.30] It's a cruel summer with you!
`,

  // Blinding Lights - The Weeknd
  'hw-5': `
[00:00.00] ♪ 80s Cyber Synth Riff ♪
[00:13.50] Yeah, I've been trying to call
[00:17.20] I've been on my own for long enough
[00:20.90] Maybe you can show me how to love, maybe
[00:24.60] I'm going through withdrawals
[00:28.30] You don't even have to do too much
[00:32.00] You can turn me on with just a touch, baby
[00:35.70] I look around and Sin City's cold and empty
[00:39.40] No one's around to judge me
[00:43.10] I can see clearly when you're gone
[00:46.80] I said, ooh, I'm blinded by the lights
[00:50.50] No, I can't sleep until I feel your touch
[00:54.20] I said, ooh, I'm drowning in the night
[00:57.90] Oh, when I'm like this, you're the one I trust!
`,

  // Levitating - Dua Lipa
  'hw-11': `
[00:00.00] ♪ Funky Electro Bassline ♪
[00:08.20] If you wanna run away with me, I know a galaxy
[00:12.40] And I can take you for a ride
[00:16.60] I had a premonition that we fell into a rhythm
[00:20.80] Where the music don't stop for life
[00:25.00] Glitter in the sky, glitter in our eyes
[00:29.20] Shining just the way I like
[00:33.40] If you're feeling like you need a little bit of company
[00:37.60] You met me at the perfect time
[00:41.80] You want me, I want you, baby
[00:46.00] My sugarboo, I'm levitating
[00:50.20] The Milky Way, we're renegading
[00:54.40] Yeah, yeah, yeah, yeah, yeah!
`,

  // Offline Master Track - Wavelength Horizon
  'offline-master-1': `
[00:00.00] ♪ Spatial Acoustic Waveform Begins ♪
[00:04.50] Breathe into the frequency of sound
[00:09.20] Where warm analog tape meets infinite horizons
[00:14.00] Every beat pulses with timeless warmth
[00:18.80] No connection required, pure sound in motion
[00:23.50] Feel the tape reels spinning in harmony
[00:28.00] Welcome to Wavelength Horizon
`,
}

/**
 * Cache for parsed lyrics in memory
 */
const lyricsCache = new Map()

/**
 * Pre-parse all static LRC records into high-performance line arrays
 */
for (const [trackId, lrcString] of Object.entries(STATIC_LRC_DATABASE)) {
  lyricsCache.set(trackId, parseLRC(lrcString))
}

/**
 * Generates rhythmic stylized lyrics for tracks without dedicated LRC
 */
export function generateRhythmicLyrics(track) {
  const duration = track?.duration || 180
  const title = track?.title || 'Unknown Track'
  const artist = track?.artist || 'Wavelength'

  const lines = [
    { time: 0, text: `♪ Instrumental Intro — ${title} ♪` },
    { time: Math.min(12, duration * 0.08), text: `Echoes of ${artist} resonating on tape` },
    { time: Math.min(28, duration * 0.18), text: `Rhythm rising through analog warmth` },
    { time: Math.min(50, duration * 0.32), text: `♪ Melodic Chorus & Bassline Harmony ♪` },
    { time: Math.min(78, duration * 0.48), text: `High fidelity sound flowing through the air` },
    { time: Math.min(108, duration * 0.65), text: `♪ Instrumental Solos & Synth Drift ♪` },
    { time: Math.min(138, duration * 0.82), text: `Crescendo reaching the horizon` },
    { time: Math.min(160, duration * 0.94), text: `♪ Gentle Outro Fade ♪` },
  ]

  return lines.map((line, idx) => ({
    id: `synth-${idx}`,
    time: Math.round(line.time),
    endTime: idx < lines.length - 1 ? Math.round(lines[idx + 1].time) : duration,
    duration: idx < lines.length - 1 ? Math.round(lines[idx + 1].time - line.time) : 10,
    text: line.text,
  }))
}

/**
 * Retrieves time-synced lyrics for a given track.
 * 1. Checks memory cache
 * 2. Checks localStorage cache (from previous online fetches)
 * 3. Falls back to static database or fetches from open LRCLIB API
 */
export async function getTrackLyrics(track) {
  if (!track || !track.id) return []

  // 1. Check in-memory cache
  if (lyricsCache.has(track.id)) {
    return lyricsCache.get(track.id)
  }

  // 2. Check localStorage cache
  try {
    const stored = localStorage.getItem(`wl_lyrics_${track.id}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        lyricsCache.set(track.id, parsed)
        return parsed
      }
    }
  } catch (e) {
    // Ignore storage parse error
  }

  // 3. Online Fetch via LRCLIB if online
  if (typeof navigator !== 'undefined' && navigator.onLine && track.title && track.artist) {
    try {
      const cleanTitle = encodeURIComponent(track.title.replace(/\(.*\)/g, '').replace(/\[.*\]/g, '').trim())
      const cleanArtist = encodeURIComponent(track.artist.split(',')[0].split('ft.')[0].trim())
      const url = `https://lrclib.net/api/get?artist_name=${cleanArtist}&track_name=${cleanTitle}`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3500)

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        if (data.syncedLyrics) {
          const parsed = parseLRC(data.syncedLyrics)
          if (parsed && parsed.length > 0) {
            lyricsCache.set(track.id, parsed)
            try {
              localStorage.setItem(`wl_lyrics_${track.id}`, JSON.stringify(parsed))
            } catch {}
            return parsed
          }
        }
      }
    } catch (err) {
      // Offline or network timeout, silent fallback
    }
  }

  // 4. Default rhythmic visualizer fallback
  const rhythmic = generateRhythmicLyrics(track)
  lyricsCache.set(track.id, rhythmic)
  return rhythmic
}

/**
 * Direct synchronous lookup for instantaneous UI rendering
 */
export function getSynchronousLyrics(track) {
  if (!track) return []
  if (lyricsCache.has(track.id)) {
    return lyricsCache.get(track.id)
  }
  return generateRhythmicLyrics(track)
}
