import { useState } from 'react'
import { useFinance } from './hooks/useFinance'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const finance = useFinance()

  if (screen === 'settings') {
    return <Settings finance={finance} onClose={() => setScreen('dashboard')} />
  }

  return <Dashboard finance={finance} onOpenSettings={() => setScreen('settings')} />
}
