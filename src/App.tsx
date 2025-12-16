import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Dashboard } from '@/components/Dashboard'
import { Login } from '@/components/Login'
import { ThemeProvider } from '@/context/ThemeContext'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleLogin = () => {
    setIsTransitioning(true)
    // Wait for transition animation before showing dashboard
    setTimeout(() => {
      setIsAuthenticated(true)
      setIsTransitioning(false)
    }, 600)
  }

  return (
    <ThemeProvider>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Login Page */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isAuthenticated
              ? 'opacity-0 scale-95 pointer-events-none -z-10'
              : isTransitioning
              ? 'opacity-0 scale-105 z-10'
              : 'opacity-100 scale-100 z-10'
          }`}
        >
          <Login onLogin={handleLogin} />
        </div>

        {/* Dashboard */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isAuthenticated
              ? 'opacity-100 scale-100 z-10'
              : 'opacity-0 scale-95 pointer-events-none -z-10'
          }`}
        >
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <Dashboard />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
