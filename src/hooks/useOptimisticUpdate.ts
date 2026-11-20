import { useCallback } from 'react'

export function useOptimisticUpdate() {
  return useCallback(async () => {
    // Simulate an asynchronous server request (70% success rate).
    await new Promise((resolve) => setTimeout(resolve, 700))
    if (Math.random() < 0.3) {
      throw new Error('Server rejected the update. Please try again.')
    }
  }, [])
}
