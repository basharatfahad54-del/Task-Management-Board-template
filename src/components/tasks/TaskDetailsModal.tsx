import Badge from '../common/Badge'
import Button from '../common/Button'
import Modal from '../common/Modal'
import { useTasks } from '../../hooks/useTasks'
import { useUI } from '../../hooks/useUI'
import { STATUS_LABELS } from '../../types/task'
import { formatDate, priorityTone } from '../../utils/taskHelpers'

export default function TaskDetailsModal() {
  const { viewTaskId, closeViewModal, openEditModal } = useUI()
  const { getTaskById } = useTasks()
  const task = viewTaskId ? getTaskById(viewTaskId) : null

  return (
    <Modal open={!!viewTaskId && !!task} title="Task Details" onClose={closeViewModal}>
      {task && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{task.title}</h3>
              <p className="mt-1 text-sm text-slate-500">Status: {STATUS_LABELS[task.status]}</p>
            </div>
            <Badge tone={priorityTone(task.priority)}>{task.priority} priority</Badge>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-700">Description</h4>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{task.description || 'No description provided.'}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Due date</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{formatDate(task.dueDate)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Updated</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{formatDate(task.updatedAt.slice(0, 10))}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-700">Labels</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {task.labels.length > 0 ? (
                task.labels.map((label) => <Badge key={label}>{label}</Badge>)
              ) : (
                <span className="text-sm text-slate-500">No labels</span>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={closeViewModal}>
              Close
            </Button>
            <Button
              onClick={() => {
                closeViewModal()
                openEditModal(task.id)
              }}
            >
              Edit Task
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
