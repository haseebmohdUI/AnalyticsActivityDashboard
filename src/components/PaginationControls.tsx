import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { useFilterStore } from '@/store/filterStore';

export function PaginationControls() {
  const { loginDataPagination, fetchLoginDataPaginated, isLoginDataLoading } = useDataStore();
  const { pageSize, setPage } = useFilterStore();
  const { currentPage, totalRecords } = loginDataPagination;

  if (totalRecords === 0) {
    return null;
  }

  const totalPages = Math.ceil(totalRecords / pageSize);
  const remainingRecords = totalRecords - (currentPage * pageSize);
  const displayedRecords = Math.min(currentPage * pageSize, totalRecords);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    setPage(newPage);
    // Fetch new page data (replace existing data, don't append)
    await fetchLoginDataPaginated({ page: newPage, page_size: pageSize }, false);
  };

  // Generate page numbers to display (show first, last, current, and neighbors)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/10 rounded-xl border border-slate-200 dark:border-slate-700">
      {/* Page info - Prominent at top */}
      <div className="flex flex-col items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="text-lg font-bold text-slate-900 dark:text-white">
          Page <span className="text-blue-600 dark:text-blue-400">{currentPage}</span> of{' '}
          <span className="text-blue-600 dark:text-blue-400">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Showing</span>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-base">
            {displayedRecords.toLocaleString()}
          </span>
          <span className="text-slate-600 dark:text-slate-400">of</span>
          <span className="font-bold text-slate-900 dark:text-white text-base">
            {totalRecords.toLocaleString()}
          </span>
          <span className="text-slate-600 dark:text-slate-400">records</span>
        </div>
        {/* Remaining records */}
        {remainingRecords > 0 && (
          <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            {remainingRecords.toLocaleString()} records remaining
          </div>
        )}
      </div>

      {/* Bottom row: Page navigation */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* First page */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || isLoginDataLoading}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoginDataLoading}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-3 py-1 text-slate-400">
                  ...
                </span>
              );
            }

            const pageNumber = pageNum as number;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                disabled={isLoginDataLoading}
                className={`min-w-[40px] px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next page */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoginDataLoading}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || isLoginDataLoading}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>

        {/* Loading indicator */}
        {isLoginDataLoading && (
          <div className="ml-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}
