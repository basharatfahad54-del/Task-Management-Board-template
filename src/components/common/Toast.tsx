import { X } from 'lucide-react'
import { useUI } from '../../hooks/useUI'

const tone: Record<string, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useUI()

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border px-4 py-3 shadow-sm ${tone[toast.type] ?? tone.info}`}
        >
          <p className="text-sm font-medium">{toast.message}</p>
          <button type="button" onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100" aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
