import type { ReactNode } from 'react'

type Tone = 'low' | 'medium' | 'high' | 'neutral'

const toneClasses: Record<Tone, string> = {
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  high: 'bg-rose-50 text-rose-700 ring-rose-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export default function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}
