import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface BaseProps {
  label: string
  error?: string
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false }
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true }

export default function Input(props: InputProps | TextareaProps) {
  const { label, error, className = '', ...rest } = props
  const base =
    'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {props.multiline ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={`${base} min-h-24 resize-y ${error ? 'border-rose-400' : 'border-slate-300'} ${className}`}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          className={`${base} ${error ? 'border-rose-400' : 'border-slate-300'} ${className}`}
        />
      )}
      {error && <span className="block text-xs text-rose-600">{error}</span>}
    </label>
  )
}
