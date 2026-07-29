import { GripVertical } from 'lucide-react'
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
import TrackRow from './TrackRow'

function SortableRow({ id, track, index }) {
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
      style={{ ...style, display: 'flex', alignItems: 'center', gap: 4 }}
      className="track-list-row"
    >
      <span
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${track.title}`}
        style={{
          display: 'flex',
          color: 'var(--text-faint)',
          cursor: 'grab',
          padding: '0 4px',
          touchAction: 'none',
        }}
      >
        <GripVertical size={16} />
      </span>
      <div style={{ flex: 1 }}>
        <TrackRow track={track} index={index} />
      </div>
    </div>
  )
}

export default function Queue() {
  const queue = usePlayerStore((s) => s.queue)
  const library = usePlayerStore((s) => s.library)
  const setQueue = usePlayerStore((s) => s.setQueue)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const tracksById = Object.fromEntries(library.map((t) => [t.id, t]))
  const queueTracks = queue.map((id) => tracksById[id]).filter(Boolean)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = queue.indexOf(active.id)
    const newIndex = queue.indexOf(over.id)
    setQueue(arrayMove(queue, oldIndex, newIndex))
  }

  return (
    <div className="queue-page">
      <div className="queue-header card">
        <div>
          <h1>Queue</h1>
          <p>Drag the handle to reorder what plays next.</p>
        </div>
        <div className="queue-summary">{queueTracks.length} tracks</div>
      </div>

      <div className="queue-list card">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={queue} strategy={verticalListSortingStrategy}>
            {queueTracks.map((track, i) => (
              <SortableRow key={track.id} id={track.id} track={track} index={i + 1} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
