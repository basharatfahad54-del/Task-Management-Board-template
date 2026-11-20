import { useDroppable } from '@dnd-kit/core'
import TaskCard from '../tasks/TaskCard'
import type { Task, TaskStatus } from '../../types/task'
import { STATUS_LABELS } from '../../types/task'

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function KanbanColumn({ status, tasks, onView, onEdit, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { status } })

  return (
    <section className="flex h-full min-h-[420px] flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">{STATUS_LABELS[status]}</h3>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {tasks.length}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-3 rounded-xl p-1 transition-colors ${isOver ? 'bg-indigo-50/80 ring-2 ring-indigo-200' : ''}`}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 p-6 text-center">
            <div>
              <p className="text-sm font-medium text-slate-700">No tasks yet</p>
              <p className="mt-1 text-xs text-slate-500">Drag tasks here or create a new one for this stage.</p>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onView={() => onView(task.id)}
              onEdit={() => onEdit(task.id)}
              onDelete={() => onDelete(task.id)}
            />
          ))
        )}
      </div>
    </section>
  )
}
