import DashboardLayout from './components/layout/DashboardLayout'
import { TaskProvider } from './context/TaskContext'
import { UIProvider } from './context/UIContext'

function App() {
  return (
    <UIProvider>
      <TaskProvider>
        <DashboardLayout />
      </TaskProvider>
    </UIProvider>
  )
}

export default App
