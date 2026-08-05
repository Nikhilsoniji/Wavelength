import { radioSeeds } from '../data/radioSeeds'

/**
 * Fetches top Indian radio stations from Radio Browser API.
 * Falls back to local seeds if network request fails or returns empty.
 */
export async function fetchIndianRadioStations() {
  try {
    const response = await fetch(
      'https://de1.api.radio-browser.info/json/stations/search?countrycode=IN&limit=12&order=votes&reverse=true',
      { signal: AbortSignal.timeout(5000) }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (!Array.isArray(data) || data.length === 0) {
      return radioSeeds
    }

    const fetchedStations = data
      .filter((station) => station.url_resolved || station.url)
      .map((station, index) => ({
        id: `radio-api-${station.stationuuid || index}`,
        title: station.name ? station.name.trim() : 'Indian Radio Station',
        artist: station.tags ? station.tags.split(',').slice(0, 2).join(', ').toUpperCase() : 'Live Radio',
        album: station.state ? `${station.state}, India` : 'Live Radio',
        src: station.url_resolved || station.url,
        cover: station.favicon || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
        duration: 0,
        isLive: true,
      }))

    // Combine fetched stations with seeds to guarantee at least valid playable URLs
    const combined = [...fetchedStations]
    // Add seeds if missing
    radioSeeds.forEach((seed) => {
      if (!combined.some((s) => s.id === seed.id || s.title === seed.title)) {
        combined.unshift(seed)
      }
    })

    return combined
  } catch (error) {
    console.warn('Failed to fetch radio stations from API, using fallback seeds:', error)
    return radioSeeds
  }
}
