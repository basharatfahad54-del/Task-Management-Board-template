import { useMemo } from 'react'
import { CheckCircle2, Circle, Clock3, ListTodo } from 'lucide-react'
import { useTasks } from '../../hooks/useTasks'
import { countByStatus } from '../../utils/taskHelpers'

export default function DashboardStats() {
  const { tasks } = useTasks()

  // Derived state: computed values instead of storing duplicate state.
  const stats = useMemo(() => {
    const total = tasks.length
    const todo = countByStatus(tasks, 'todo')
    const inProgress = countByStatus(tasks, 'in-progress')
    const completed = countByStatus(tasks, 'done')
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
    const highPriority = tasks.filter((t) => t.priority === 'High').length
    return { total, todo, inProgress, completed, completionRate, highPriority }
  }, [tasks])

  const cards = [
    { label: 'Total Tasks', value: stats.total, icon: ListTodo, tone: 'bg-indigo-50 text-indigo-700' },
    { label: 'Todo Tasks', value: stats.todo, icon: Circle, tone: 'bg-slate-100 text-slate-700' },
    { label: 'In Progress Tasks', value: stats.inProgress, icon: Clock3, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Completed Tasks', value: stats.completed, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700' },
  ]

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
        <span>Completion: <strong className="text-slate-900">{stats.completionRate}%</strong></span>
        <span>High priority: <strong className="text-slate-900">{stats.highPriority}</strong></span>
      </div>
    </section>
  )
}
