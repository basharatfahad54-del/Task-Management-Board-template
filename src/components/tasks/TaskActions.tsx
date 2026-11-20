import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TaskActionsProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function TaskActions({ onView, onEdit, onDelete }: TaskActionsProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function run(action: () => void) {
    action()
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Task actions"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button type="button" onClick={() => run(onView)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <Eye size={14} /> View
          </button>
          <button type="button" onClick={() => run(onEdit)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <Pencil size={14} /> Edit
          </button>
          <button type="button" onClick={() => run(onDelete)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}
