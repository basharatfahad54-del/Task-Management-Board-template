export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'

export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  labels: string[]
  createdAt: string
  updatedAt: string
}

export interface TaskDraft {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  labels: string[]
}

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'review', 'done']

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
}

export const PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High']
