import type { Task, TaskDraft, TaskPriority, TaskStatus } from '../types/task'

export function createTask(draft: TaskDraft): Task {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: draft.title.trim(),
    description: draft.description.trim(),
    status: draft.status,
    priority: draft.priority,
    dueDate: draft.dueDate,
    labels: draft.labels.map((l) => l.trim()).filter(Boolean),
    createdAt: now,
    updatedAt: now,
  }
}

export function updateTask(task: Task, draft: TaskDraft): Task {
  return {
    ...task,
    title: draft.title.trim(),
    description: draft.description.trim(),
    status: draft.status,
    priority: draft.priority,
    dueDate: draft.dueDate,
    labels: draft.labels.map((l) => l.trim()).filter(Boolean),
    updatedAt: new Date().toISOString(),
  }
}

export function countByStatus(tasks: Task[], status: TaskStatus): number {
  return tasks.filter((t) => t.status === status).length
}

export function filterTasks(tasks: Task[], search: string, priority: TaskPriority | 'All'): Task[] {
  const q = search.trim().toLowerCase()
  return tasks.filter((task) => {
    const matchesSearch = q.length === 0 || task.title.toLowerCase().includes(q)
    const matchesPriority = priority === 'All' || task.priority === priority
    return matchesSearch && matchesPriority
  })
}

export function formatDate(date: string): string {
  if (!date) return 'No due date'
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return 'No due date'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function priorityTone(priority: TaskPriority): 'low' | 'medium' | 'high' {
  if (priority === 'High') return 'high'
  if (priority === 'Medium') return 'medium'
  return 'low'
}
