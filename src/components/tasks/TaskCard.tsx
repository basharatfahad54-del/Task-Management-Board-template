import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, GripVertical } from 'lucide-react'
import Badge from '../common/Badge'
import TaskActions from './TaskActions'
import type { Task } from '../../types/task'
import { formatDate, priorityTone } from '../../utils/taskHelpers'

interface TaskCardProps {
  task: Task
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  overlay?: boolean
}

export default function TaskCard({ task, onView, onEdit, onDelete, overlay = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { taskId: task.id, status: task.status },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <article
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      className={`group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md ${
        isDragging ? 'opacity-40' : 'opacity-100'
      } ${overlay ? 'rotate-1 shadow-xl ring-2 ring-indigo-200' : ''}`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 cursor-grab rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
          aria-label="Drag task"
          {...listeners}
          {...attributes}
        >
          <GripVertical size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <button type="button" onClick={onView} className="text-left">
              <h4 className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-indigo-700">{task.title}</h4>
            </button>
            <TaskActions onView={onView} onEdit={onEdit} onDelete={onDelete} />
          </div>
          {task.description && <p className="mt-1 line-clamp-2 text-xs text-slate-600">{task.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
            {task.labels.slice(0, 2).map((label) => (
              <Badge key={label}>{label}</Badge>
            ))}
            {task.labels.length > 2 && <Badge>+{task.labels.length - 2}</Badge>}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays size={14} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
