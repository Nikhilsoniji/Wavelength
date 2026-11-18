import { useMemo } from 'react'
import {
  GripVertical,
  Shuffle,
  Trash2,
  Play,
  Pause,
  Mic2,
  Tv,
  X,
  Disc3,
  Music,
  ListOrdered
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { usePlayerStore } from '../store/usePlayerStore'
import { haptics } from '../utils/haptics'
import TrackRow from './TrackRow'
import AlbumArt from './AlbumArt'

function SortableRow({ id, track, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, display: 'flex', alignItems: 'center', gap: 6 }}
      className="track-list-row queue-sortable-row"
    >
      <span
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${track.title}`}
        className="queue-drag-handle"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <TrackRow track={track} index={index} />
      </div>

      {onRemove && (
        <button
          className="queue-remove-item-btn"
          onClick={(e) => {
            e.stopPropagation()
            haptics.impact()
            onRemove(track.id)
          }}
          title="Remove from queue"
          aria-label={`Remove ${track.title} from queue`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default function Queue() {
  const queue = usePlayerStore((s) => s.queue)
  const tracksById = usePlayerStore((s) => s.tracksById)
  const currentId = usePlayerStore((s) => s.currentId)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const toggle = usePlayerStore((s) => s.toggle)
  const setQueue = usePlayerStore((s) => s.setQueue)
  const shuffleQueue = usePlayerStore((s) => s.shuffleQueue)
  const clearQueue = usePlayerStore((s) => s.clearQueue)
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue)
  const setIsLyricsOpen = usePlayerStore((s) => s.setIsLyricsOpen)
  const toggleVideoMode = usePlayerStore((s) => s.toggleVideoMode)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // O(1) track lookup from Map
  const currentTrack = useMemo(() => {
    return tracksById.get(currentId) || null
  }, [tracksById, currentId])

  // Split queue into Now Playing & Upcoming Tracks
  const upcomingIds = useMemo(() => {
    if (!currentId) return queue
    const idx = queue.indexOf(currentId)
    if (idx === -1) return queue
    return [...queue.slice(idx + 1), ...queue.slice(0, idx)]
  }, [queue, currentId])

  const upcomingTracks = useMemo(() => {
    return upcomingIds.map((id) => tracksById.get(id)).filter(Boolean)
  }, [upcomingIds, tracksById])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = queue.indexOf(active.id)
    const newIndex = queue.indexOf(over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      setQueue(arrayMove(queue, oldIndex, newIndex))
    }
  }

  const handleShuffle = () => {
    haptics.impact()
    shuffleQueue()
  }

  const handleClear = () => {
    haptics.impact()
    clearQueue()
  }

  return (
    <div className="queue-page">
      {/* Queue Header */}
      <div className="queue-header">
        <div>
          <div className="queue-badge-pill">
            <ListOrdered size={13} />
            <span>PLAYBACK QUEUE</span>
          </div>
          <h1 className="queue-title">Up Next & Queue</h1>
          <p className="queue-desc">Seamless drag-and-drop reordering, instant shuffle, and queue management.</p>
        </div>

        <div className="queue-header-actions">
          <button
            className="queue-action-pill-btn"
            onClick={handleShuffle}
            title="Shuffle upcoming queue tracks"
          >
            <Shuffle size={14} />
            <span>Shuffle Queue</span>
          </button>

          <button
            className="queue-action-pill-btn queue-clear-btn"
            onClick={handleClear}
            title="Clear upcoming queue tracks"
          >
            <Trash2 size={14} />
            <span>Clear Queue</span>
          </button>
        </div>
      </div>

      {/* Now Playing Spotlight Card */}
      {currentTrack && (
        <section className="queue-now-playing-card">
          <div className="queue-np-label">
            <span className="live-dot" />
            <span>NOW PLAYING</span>
          </div>

          <div className="queue-np-content">
            <div className="queue-np-art-wrap">
              <AlbumArt
                hue={currentTrack.hue || 260}
                thumbnail={currentTrack.thumbnail || currentTrack.cover}
                title={currentTrack.title}
                artist={currentTrack.artist}
                className="queue-np-art"
              />
              <button
                className="queue-np-play-overlay"
                onClick={toggle}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={24} fill="#000" /> : <Play size={24} fill="#000" />}
              </button>
            </div>

            <div className="queue-np-info">
              <h2 className="queue-np-title">{currentTrack.title}</h2>
              <p className="queue-np-artist">{currentTrack.isLive ? 'Live Radio Broadcast' : currentTrack.artist}</p>
              <div className="queue-np-tags">
                <span className="queue-np-album">{currentTrack.album}</span>
                <span className="queue-dot-sep">•</span>
                <span className="queue-np-duration">{currentTrack.formattedDuration || '3:20'}</span>
                {currentTrack.isOfflineReady && <span className="queue-offline-pill">OFFLINE READY</span>}
              </div>
            </div>

            <div className="queue-np-actions">
              <button
                className="queue-np-btn"
                onClick={() => setIsLyricsOpen(true)}
                title="Open Live Lyrics"
              >
                <Mic2 size={16} />
                <span>Lyrics</span>
              </button>

              {currentTrack.isYouTube && (
                <button
                  className="queue-np-btn"
                  onClick={() => toggleVideoMode('pip')}
                  title="Watch Video Stream"
                >
                  <Tv size={16} />
                  <span>Video</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Tracks Header & Sortable List */}
      <div className="queue-upcoming-header">
        <h3 className="queue-upcoming-title">
          <span>Upcoming Tracks</span>
          <span className="queue-count-badge">{upcomingTracks.length}</span>
        </h3>
        <span className="queue-drag-hint">Grab handles to reorder</span>
      </div>

      {upcomingTracks.length === 0 ? (
        <div className="queue-empty-box">
          <Disc3 size={36} className="text-cyan spin-slow" />
          <h4>Your queue is empty</h4>
          <p>Play any track, album, or playlist to populate your queue.</p>
        </div>
      ) : (
        <div className="queue-list">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={upcomingIds} strategy={verticalListSortingStrategy}>
              {upcomingTracks.map((track, i) => (
                <SortableRow
                  key={track.id}
                  id={track.id}
                  track={track}
                  index={i + 1}
                  onRemove={removeFromQueue}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
