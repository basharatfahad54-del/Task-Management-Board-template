import { useMemo, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import type { Task, TaskDraft, TaskPriority, TaskStatus } from '../../types/task'
import { PRIORITY_OPTIONS, STATUS_LABELS, TASK_STATUSES } from '../../types/task'

interface TaskFormProps {
  initialTask?: Task | null
  onSubmit: (draft: TaskDraft) => void
  onCancel: () => void
}

interface Errors {
  title?: string
  dueDate?: string
  labels?: string
}

function toDraft(task?: Task | null): TaskDraft {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'Medium',
    dueDate: task?.dueDate ?? '',
    labels: task?.labels ?? [],
  }
}

export default function TaskForm({ initialTask, onSubmit, onCancel }: TaskFormProps) {
  // Form input state is kept local to TaskForm (state colocation).
  const [draft, setDraft] = useState<TaskDraft>(() => toDraft(initialTask))
  const [labelsInput, setLabelsInput] = useState(() => (initialTask?.labels ?? []).join(', '))
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState(false)

  const submitLabel = useMemo(() => (initialTask ? 'Save Changes' : 'Create Task'), [initialTask])

  function validate(next: TaskDraft, labelsRaw: string): Errors {
    const nextErrors: Errors = {}
    if (!next.title.trim()) nextErrors.title = 'Title is required.'
    if (!next.dueDate) nextErrors.dueDate = 'Due date is required.'
    if (labelsRaw.trim()) {
      const parts = labelsRaw.split(',').map((p) => p.trim()).filter(Boolean)
      if (parts.length === 0) nextErrors.labels = 'Enter at least one label or leave blank.'
      if (parts.some((p) => p.length > 24)) nextErrors.labels = 'Each label must be 24 characters or less.'
    }
    return nextErrors
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextDraft: TaskDraft = {
      ...draft,
      labels: labelsInput
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
    }
    const nextErrors = validate(nextDraft, labelsInput)
    setErrors(nextErrors)
    setTouched(true)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit(nextDraft)
  }

  function update<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setDraft((prev) => {
      const next = { ...prev, [key]: value }
      if (touched) setErrors(validate(next, key === 'labels' ? String(value) : labelsInput))
      return next
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        value={draft.title}
        onChange={(e) => update('title', e.target.value)}
        placeholder="e.g. Design onboarding flow"
        error={errors.title}
      />
      <Input
        multiline
        label="Description"
        value={draft.description}
        onChange={(e) => update('description', e.target.value)}
        placeholder="Add details, acceptance criteria, or links..."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="block text-sm font-medium text-slate-700">Status</span>
          <select
            value={draft.status}
            onChange={(e) => update('status', e.target.value as TaskStatus)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="block text-sm font-medium text-slate-700">Priority</span>
          <select
            value={draft.priority}
            onChange={(e) => update('priority', e.target.value as TaskPriority)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Due Date"
          type="date"
          value={draft.dueDate}
          onChange={(e) => update('dueDate', e.target.value)}
          error={errors.dueDate}
        />
        <Input
          label="Labels"
          value={labelsInput}
          onChange={(e) => {
            const val = e.target.value
            setLabelsInput(val)
            if (touched) setErrors(validate(draft, val))
          }}
          placeholder="design, frontend, urgent"
          error={errors.labels}
        />
      </div>
      <p className="text-xs text-slate-500">Separate labels with commas.</p>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
