import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import type { ApiError } from '@/services/api';

interface DataErrorBannerProps {
  errors: {
    loginData: ApiError | null;
    queryActivity: ApiError | null;
    licenseeData: ApiError | null;
  };
  isFromFallback: {
    loginData: boolean;
    queryActivity: boolean;
    licenseeData: boolean;
  };
  onDismiss: () => void;
}

export function DataErrorBanner({ errors, isFromFallback, onDismiss }: DataErrorBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if any data is from fallback
  const hasAnyFallback =
    isFromFallback.loginData ||
    isFromFallback.queryActivity ||
    isFromFallback.licenseeData;

  if (!hasAnyFallback || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss();
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
            No Data Available
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
            We're experiencing issues connecting to the data source. Some sections may appear empty.
          </p>
          <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
            {isFromFallback.loginData && (
              <li>• Login data: {errors.loginData?.message || 'Failed to load'}</li>
            )}
            {isFromFallback.queryActivity && (
              <li>• Query activity: {errors.queryActivity?.message || 'Failed to load'}</li>
            )}
            {isFromFallback.licenseeData && (
              <li>• Licensee data: {errors.licenseeData?.message || 'Failed to load'}</li>
            )}
          </ul>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
