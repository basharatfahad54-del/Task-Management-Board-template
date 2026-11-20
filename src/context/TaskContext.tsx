import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { usePersistTasks } from '../hooks/useLocalStorage'
import { useOptimisticUpdate } from '../hooks/useOptimisticUpdate'
import type { Task, TaskDraft, TaskStatus } from '../types/task'
import { loadTasks } from '../utils/storage'
import { createTask, updateTask } from '../utils/taskHelpers'

type TaskAction =
  | { type: 'add'; task: Task }
  | { type: 'update'; id: string; draft: TaskDraft }
  | { type: 'delete'; id: string }
  | { type: 'move'; id: string; status: TaskStatus }
  | { type: 'replace'; tasks: Task[] }

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'add':
      return [action.task, ...state]
    case 'update':
      return state.map((task) => (task.id === action.id ? updateTask(task, action.draft) : task))
    case 'delete':
      return state.filter((task) => task.id !== action.id)
    case 'move':
      return state.map((task) =>
        task.id === action.id ? { ...task, status: action.status, updatedAt: new Date().toISOString() } : task,
      )
    case 'replace':
      return action.tasks
    default:
      return state
  }
}

interface TaskContextValue {
  tasks: Task[]
  addTask: (draft: TaskDraft) => Task
  editTask: (id: string, draft: TaskDraft) => void
  deleteTask: (id: string) => void
  moveTaskOptimistic: (
    id: string,
    status: TaskStatus,
    notify: (type: 'success' | 'error', message: string) => void,
  ) => Promise<void>
  getTaskById: (id: string) => Task | undefined
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, loadTasks)
  const simulateRequest = useOptimisticUpdate()
  usePersistTasks(tasks)

  const addTask = useCallback((draft: TaskDraft) => {
    const task = createTask(draft)
    dispatch({ type: 'add', task })
    return task
  }, [])

  const editTask = useCallback((id: string, draft: TaskDraft) => {
    dispatch({ type: 'update', id, draft })
  }, [])

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'delete', id })
  }, [])

  const moveTaskOptimistic = useCallback(
    async (id: string, status: TaskStatus, notify: (type: 'success' | 'error', message: string) => void) => {
      const current = tasks.find((t) => t.id === id)
      if (!current || current.status === status) return
      const previousStatus = current.status

      // Optimistic update: immediately move task to selected column.
      dispatch({ type: 'move', id, status })

      try {
        await simulateRequest()
        notify('success', 'Task moved successfully.')
      } catch {
        // Rollback: restore the previous task status on failure.
        dispatch({ type: 'move', id, status: previousStatus })
        notify('error', 'Failed to move task. Status was rolled back.')
      }
    },
    [simulateRequest, tasks],
  )

  const getTaskById = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks])

  const value = useMemo(
    () => ({ tasks, addTask, editTask, deleteTask, moveTaskOptimistic, getTaskById }),
    [tasks, addTask, editTask, deleteTask, moveTaskOptimistic, getTaskById],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTaskContext() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider')
  return ctx
}
