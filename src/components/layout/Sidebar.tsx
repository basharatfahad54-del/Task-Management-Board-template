import { LayoutDashboard, FolderKanban, Settings, Users } from 'lucide-react'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Projects', icon: FolderKanban, active: false },
  { label: 'Team', icon: Users, active: false },
  { label: 'Settings', icon: Settings, active: false },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">TM</div>
        <div>
          <p className="text-sm font-semibold text-slate-900">TaskFlow</p>
          <p className="text-xs text-slate-500">Kanban Workspace</p>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {items.map(({ label, icon: Icon, active }) => (
          <div
            key={label}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
              active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon size={18} />
            {label}
          </div>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-900">Pro workspace</p>
          <p className="mt-1 text-xs text-slate-600">Organize tasks, track progress, and deliver faster.</p>
        </div>
      </div>
    </aside>
  )
}
