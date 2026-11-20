import Modal from '../common/Modal'
import TaskForm from './TaskForm'
import { useTasks } from '../../hooks/useTasks'
import { useUI } from '../../hooks/useUI'

export default function TaskModal() {
  const { isTaskModalOpen, editingTaskId, closeTaskModal, addToast } = useUI()
  const { addTask, editTask, getTaskById } = useTasks()

  const editingTask = editingTaskId ? getTaskById(editingTaskId) : null
  const title = editingTask ? 'Edit Task' : 'Create New Task'

  return (
    <Modal open={isTaskModalOpen} title={title} onClose={closeTaskModal}>
      {isTaskModalOpen && (
        <TaskForm
          // Key resets form state when opening for a new task or switching task IDs.
          key={editingTaskId ?? 'new-task'}
          initialTask={editingTask}
          onCancel={closeTaskModal}
          onSubmit={(draft) => {
            if (editingTaskId) {
              editTask(editingTaskId, draft)
              addToast('success', 'Task updated successfully.')
            } else {
              addTask(draft)
              addToast('success', 'Task created successfully.')
            }
            closeTaskModal()
          }}
        />
      )}
    </Modal>
  )
}
