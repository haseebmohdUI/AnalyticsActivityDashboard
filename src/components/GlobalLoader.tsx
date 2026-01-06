import { Loader2 } from 'lucide-react';

interface GlobalLoaderProps {
  message?: string;
}

export function GlobalLoader({ message = 'Loading dashboard data...' }: GlobalLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[320px] border border-slate-200 dark:border-slate-700">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {message}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This may take a few moments...
          </p>
        </div>
      </div>
    </div>
  );
}
