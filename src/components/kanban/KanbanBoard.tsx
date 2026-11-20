import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import KanbanColumn from './KanbanColumn'
import TaskCard from '../tasks/TaskCard'
import { useTasks } from '../../hooks/useTasks'
import { useUI } from '../../hooks/useUI'
import { TASK_STATUSES, type Task, type TaskStatus } from '../../types/task'
import { filterTasks } from '../../utils/taskHelpers'

export default function KanbanBoard() {
  const { tasks, moveTaskOptimistic, deleteTask } = useTasks()
  const { searchQuery, priorityFilter, setPriorityFilter, addToast, openViewModal, openEditModal } = useUI()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  // Derived state: filtered tasks and per-column lists are computed, not stored separately.
  const filteredTasks = useMemo(() => filterTasks(tasks, searchQuery, priorityFilter), [tasks, searchQuery, priorityFilter])

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], 'in-progress': [], review: [], done: [] }
    for (const task of filteredTasks) {
      map[task.status].push(task)
    }
    return map
  }, [filteredTasks])

  function onDragStart(event: DragStartEvent) {
    const id = String(event.active.id)
    const task = tasks.find((t) => t.id === id) ?? null
    setActiveTask(task)
  }

  function resolveTargetStatus(event: DragEndEvent): TaskStatus | null {
    const { over } = event
    if (!over) return null
    const overId = String(over.id)
    if ((TASK_STATUSES as string[]).includes(overId)) return overId as TaskStatus
    const overTask = tasks.find((t) => t.id === overId)
    return overTask?.status ?? null
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active } = event
    const taskId = String(active.id)
    const targetStatus = resolveTargetStatus(event)
    setActiveTask(null)
    if (!targetStatus) return
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === targetStatus) return
    await moveTaskOptimistic(taskId, targetStatus, addToast)
  }

  function handleDelete(id: string) {
    const ok = window.confirm('Delete this task? This action cannot be undone.')
    if (!ok) return
    deleteTask(id)
    addToast('success', 'Task deleted.')
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Kanban Board</h2>
          <p className="text-sm text-slate-500">Drag and drop tasks between columns to update progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">
            Priority filter
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'All' | 'Low' | 'Medium' | 'High')}
              className="ml-2 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TASK_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeTask ? (
            <div className="w-80 max-w-[85vw]">
              <TaskCard task={activeTask} onView={() => {}} onEdit={() => {}} onDelete={() => {}} overlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  )
}
