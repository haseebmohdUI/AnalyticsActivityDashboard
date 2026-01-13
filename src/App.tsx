import { useState, useEffect, useMemo } from 'react'
import { Dashboard } from '@/components/Dashboard'
import { Login } from '@/components/Login'
import { GlobalLoader } from '@/components/GlobalLoader'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const { isAuthenticated: isAuthStoreAuthenticated } = useAuthStore()
  const {
    isLoading,
    fetchAllData,
    isDataStale,
    loginData,
    isLoginDataLoading,
    isQueryActivityLoading,
    isLicenseeDataLoading,
    isACSParticipantDataLoading,
    queryActivityData,
    licenseeData,
    acsParticipantData
  } = useDataStore()

  // Compute loading statuses with useMemo to avoid unnecessary re-renders
  const loadingStatuses = useMemo(() => {
    const statuses = [
      {
        name: 'Login Activity Data',
        isLoading: isLoginDataLoading,
        isCompleted: !isLoginDataLoading && loginData.length > 0
      },
      {
        name: 'Query Activity Data',
        isLoading: isQueryActivityLoading,
        isCompleted: !isQueryActivityLoading && queryActivityData.length > 0
      },
      {
        name: 'Licensee Directory Data',
        isLoading: isLicenseeDataLoading,
        isCompleted: !isLicenseeDataLoading && licenseeData.length > 0
      },
      {
        name: 'ACS Participant Data',
        isLoading: isACSParticipantDataLoading,
        isCompleted: !isACSParticipantDataLoading && acsParticipantData.length > 0
      }
    ];

    // Log status changes for debugging
    statuses.forEach(status => {
      if (status.isCompleted) {
        console.log(`✅ ${status.name} completed`);
      }
    });

    return statuses;
  }, [isLoginDataLoading, isQueryActivityLoading, isLicenseeDataLoading, isACSParticipantDataLoading, loginData.length, queryActivityData.length, licenseeData.length, acsParticipantData.length])

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

  // Control loader visibility
  useEffect(() => {
    // Show loader when any data is loading
    if (isLoading) {
      setShowLoader(true)
    } else {
      // All loading complete, show completion message briefly then hide
      const allCompleted = loadingStatuses.every(s => s.isCompleted)

      if (allCompleted) {
        // Keep showing for 1 second to display completion status
        const timer = setTimeout(() => {
          setShowLoader(false)
        }, 1000)

        return () => clearTimeout(timer)
      } else {
        setShowLoader(false)
      }
    }
  }, [isLoading, loadingStatuses])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Global Loader */}
      {showLoader && <GlobalLoader loadingStatuses={loadingStatuses} />}

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
