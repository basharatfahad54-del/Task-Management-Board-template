import { Bell, Plus, Search } from 'lucide-react'
import Button from '../common/Button'
import { useUI } from '../../hooks/useUI'

export default function Header() {
  const { searchQuery, setSearchQuery, openCreateModal } = useUI()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white lg:hidden">TM</div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">Task Management Board</h1>
            <p className="text-xs text-slate-500 sm:text-sm">Plan, track, and ship work across your team</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <label className="relative block min-w-0 sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">MF</div>
              <span className="hidden text-sm font-medium text-slate-700 sm:block">Fahad</span>
            </div>
            <Button onClick={openCreateModal} className="whitespace-nowrap">
              <Plus size={16} /> Add Task
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
