import type { Task } from '../types/task'
import { TASK_STATUSES } from '../types/task'

const STORAGE_KEY = 'kanban.tasks.v1'

function isValidTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    typeof v.description === 'string' &&
    typeof v.status === 'string' &&
    (TASK_STATUSES as string[]).includes(v.status) &&
    (v.priority === 'Low' || v.priority === 'Medium' || v.priority === 'High') &&
    typeof v.dueDate === 'string' &&
    Array.isArray(v.labels) &&
    v.labels.every((l) => typeof l === 'string') &&
    typeof v.createdAt === 'string' &&
    typeof v.updatedAt === 'string'
  )
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidTask)
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // ignore storage errors (quota/private mode)
  }
}
