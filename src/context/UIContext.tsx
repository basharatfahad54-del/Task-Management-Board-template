import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { TaskPriority } from '../types/task'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface UIContextValue {
  isTaskModalOpen: boolean
  editingTaskId: string | null
  viewTaskId: string | null
  searchQuery: string
  priorityFilter: TaskPriority | 'All'
  toasts: ToastItem[]
  openCreateModal: () => void
  openEditModal: (taskId: string) => void
  openViewModal: (taskId: string) => void
  closeTaskModal: () => void
  closeViewModal: () => void
  setSearchQuery: (value: string) => void
  setPriorityFilter: (value: TaskPriority | 'All') => void
  addToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [viewTaskId, setViewTaskId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All')
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = crypto.randomUUID()
      // Batched UI updates: add toast now, schedule removal separately.
      setToasts((prev) => [...prev, { id, type, message }])
      window.setTimeout(() => removeToast(id), 3200)
    },
    [removeToast],
  )

  const openCreateModal = useCallback(() => {
    setEditingTaskId(null)
    setIsTaskModalOpen(true)
  }, [])

  const openEditModal = useCallback((taskId: string) => {
    setEditingTaskId(taskId)
    setIsTaskModalOpen(true)
  }, [])

  const openViewModal = useCallback((taskId: string) => {
    setViewTaskId(taskId)
  }, [])

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false)
    setEditingTaskId(null)
  }, [])

  const closeViewModal = useCallback(() => {
    setViewTaskId(null)
  }, [])

  const value = useMemo(
    () => ({
      isTaskModalOpen,
      editingTaskId,
      viewTaskId,
      searchQuery,
      priorityFilter,
      toasts,
      openCreateModal,
      openEditModal,
      openViewModal,
      closeTaskModal,
      closeViewModal,
      setSearchQuery,
      setPriorityFilter,
      addToast,
      removeToast,
    }),
    [
      isTaskModalOpen,
      editingTaskId,
      viewTaskId,
      searchQuery,
      priorityFilter,
      toasts,
      openCreateModal,
      openEditModal,
      openViewModal,
      closeTaskModal,
      closeViewModal,
      addToast,
      removeToast,
    ],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUIContext() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUIContext must be used within UIProvider')
  return ctx
}
