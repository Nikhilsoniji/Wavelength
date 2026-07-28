# Wavelength

A music player built in React — a Spotify-inspired *pattern* (persistent
playback, queue management, seekable progress) reimagined with a warm,
analog "tape deck" visual identity instead of a literal clone.

**[Live demo →](#)** https://wavelength-5rso02w3c-wavelength3.vercel.app

![screenshot placeholder](#)

## Features

- Persistent playback across views — the audio element lives at the app
  root, not inside any single page, so switching between Library and Queue
  never interrupts what's playing
- Custom `usePlayerStore` (Zustand) as the single source of truth for
  playback state, with a `useAudioEngine` hook as the only thing allowed to
  touch the actual `<audio>` element
- Drag-and-drop queue reordering (`@dnd-kit`)
- Waveform-style seek bar, click or arrow-key seekable
- Shuffle / repeat-one / repeat-all
- Live search across title, artist, and album
- Generated album art (CSS gradients keyed to a per-track hue) — no image
  assets required, so the demo runs with zero setup

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. Demo audio is streamed from
[SoundHelix](https://www.soundhelix.com)'s free test tracks — swap the
`src` values in `src/data/tracks.js` for your own library.

## Architecture notes (useful for interviews)

The interesting engineering problem in a player like this isn't the UI, it's
**keeping exactly one `<audio>` element in sync with a UI that has many
places to trigger or read playback** (a track row, the mini player bar, the
queue). The rule this project follows:

- **Commands flow one way**: store → `<audio>` (play, pause, seek, volume).
- **Facts flow the other way**: `<audio>` → store (`timeupdate`,
  `loadedmetadata`, `ended`).
- Nothing reads `audio.currentTime` directly except the one effect in
  `useAudioEngine` responsible for writing it into the store.

That single-direction-per-concern rule is what avoids the classic bugs (a
progress bar that jumps, or `next()` firing twice on repeat).

## Stretch ideas (good next commits)

- Replace the deterministic fake waveform with a real one, computed once via
  `AudioContext.decodeAudioData` and cached per track
- Persist "liked" tracks and last-played state to `localStorage`
- Add keyboard shortcuts (space = play/pause, arrows = seek/volume)
- Swap the tab-based view switcher for `react-router`, keeping `<audio>`
  lifted to a layout route so persistence still holds
- Real backend (Supabase) for a multi-user library instead of static data

## Tech stack

React · Zustand · @dnd-kit · lucide-react · Vite
