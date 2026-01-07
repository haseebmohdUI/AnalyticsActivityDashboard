import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { useDataStore } from '@/store/dataStore';
import { filterRawData } from '@/utils/dataFilters';
import { PaginationControls } from './PaginationControls';

export function DataTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const { startDate, endDate, selectedCompanies, searchUsername } = useFilterStore();
  const { loginData } = useDataStore();

  // First apply global filters, then local search
  const filteredData = useMemo(() => {
    const globalFiltered = filterRawData(loginData, startDate, endDate, selectedCompanies, searchUsername);

    if (!searchTerm) return globalFiltered;

    const lowerSearch = searchTerm.toLowerCase();
    return globalFiltered.filter((record) => {
      const loginTime = new Date(record.datetime).toLocaleString();
      return (
        loginTime.toLowerCase().includes(lowerSearch) ||
        record.username.toLowerCase().includes(lowerSearch) ||
        record.firstName.toLowerCase().includes(lowerSearch) ||
        record.lastName.toLowerCase().includes(lowerSearch) ||
        record.company.toLowerCase().includes(lowerSearch)
      );
    });
  }, [loginData, searchTerm, startDate, endDate, selectedCompanies, searchUsername]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Login Data Table
            </CardTitle>
            <CardDescription>
              All login records ({filteredData.length.toLocaleString()} {filteredData.length === 1 ? 'entry' : 'entries'})
            </CardDescription>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search across all fields..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* API Pagination Controls */}
        <div className="mb-4">
          <PaginationControls />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  Login Time
                </th>
                <th className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  Username
                </th>
                <th className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  First Name
                </th>
                <th className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  Last Name
                </th>
                <th className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  Company
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-slate-500 dark:text-slate-400">
                    No records found
                  </td>
                </tr>
              ) : (
                currentData.map((record, index) => (
                  <tr
                    key={`${record.username}-${record.datetime}-${index}`}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatDateTime(record.datetime)}
                    </td>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[200px] inline-block" title={record.username}>
                        {record.username}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-300">
                      {record.firstName}
                    </td>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-300">
                      {record.lastName}
                    </td>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[250px] inline-block" title={record.company}>
                        {record.company}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing {currentData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length.toLocaleString()} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
