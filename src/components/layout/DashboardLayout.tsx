import ToastContainer from '../common/Toast'
import DashboardStats from '../kanban/DashboardStats'
import KanbanBoard from '../kanban/KanbanBoard'
import TaskDetailsModal from '../tasks/TaskDetailsModal'
import TaskModal from '../tasks/TaskModal'
import Header from './Header'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 space-y-6 p-4 sm:p-6">
            <DashboardStats />
            <KanbanBoard />
          </main>
        </div>
      </div>
      <TaskModal />
      <TaskDetailsModal />
      <ToastContainer />
    </div>
  )
}
