import { useEffect } from 'react'
import type { Task } from '../types/task'
import { saveTasks } from '../utils/storage'

export function usePersistTasks(tasks: Task[]) {
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])
}
