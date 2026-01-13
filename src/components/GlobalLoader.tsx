import { Check, Loader2 } from 'lucide-react';

interface LoadingStatus {
  name: string;
  isLoading: boolean;
  isCompleted: boolean;
}

interface GlobalLoaderProps {
  loadingStatuses?: LoadingStatus[];
}

export function GlobalLoader({ loadingStatuses = [] }: GlobalLoaderProps) {
  // Default statuses if none provided
  const statuses = loadingStatuses.length > 0 ? loadingStatuses : [
    { name: 'Loading dashboard data...', isLoading: true, isCompleted: false }
  ];

  const allCompleted = statuses.every(s => s.isCompleted);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl animate-pulse opacity-20"></div>

        {/* Card content */}
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 min-w-[400px] max-w-[500px] border border-slate-200 dark:border-slate-700">
          {/* Modern spinner with gradient ring */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-r-purple-600 dark:border-r-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>

          {/* Text content */}
          <div className="w-full space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
              {allCompleted ? 'Loading Complete!' : 'Loading Dashboard Data'}
            </h3>

            {/* Loading status list */}
            <div className="space-y-2">
              {statuses.map((status) => (
                <div
                  key={status.name}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                    status.isCompleted
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  {status.isCompleted ? (
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : status.isLoading ? (
                    <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-full flex-shrink-0"></div>
                  )}
                  <span className={`text-sm transition-all duration-300 ${
                    status.isCompleted
                      ? 'text-green-700 dark:text-green-400 font-semibold'
                      : status.isLoading
                      ? 'text-slate-900 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {status.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress indicator */}
            {!allCompleted && (
              <div className="flex items-center justify-center gap-1 pt-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
