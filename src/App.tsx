import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/Dashboard'
import { Login } from '@/components/Login'
import { GlobalLoader } from '@/components/GlobalLoader'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { isAuthenticated: isAuthStoreAuthenticated } = useAuthStore()
  const { isLoading, fetchAllData, isDataStale, loginData } = useDataStore()

  // Check if user is already authenticated on mount
  useEffect(() => {
    if (isAuthStoreAuthenticated) {
      setIsAuthenticated(true)

      // Check if we need to fetch data
      // Fetch if: no data OR data is stale
      if (loginData.length === 0 || isDataStale()) {
        console.log('Fetching fresh data on mount...')
        fetchAllData()
      } else {
        console.log('Using cached data from localStorage')
      }
    }
  }, [isAuthStoreAuthenticated])

  const handleLogin = async () => {
    setIsTransitioning(true)

    // Fetch data immediately after login
    await fetchAllData()

    // Wait for transition animation before showing dashboard
    setTimeout(() => {
      setIsAuthenticated(true)
      setIsTransitioning(false)
    }, 600)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Global Loader */}
      {isLoading && <GlobalLoader />}

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
        <Dashboard />
      </div>
    </div>
  )
}

export default App
