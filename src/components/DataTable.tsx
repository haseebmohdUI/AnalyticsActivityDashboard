import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { useDataStore } from '@/store/dataStore';

type SortField = 'datetime' | 'username' | 'firstName' | 'lastName' | 'company';
type SortOrder = 'asc' | 'desc';

export function DataTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('datetime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const rowsPerPage = 20;

  const { firstName, lastName, company, username } = useFilterStore();
  const { loginData } = useDataStore();

  // Apply filters from sidebar
  const filteredData = useMemo(() => {
    return loginData.filter((record) => {
      const matchesFirstName = !firstName || record.firstName.toLowerCase().includes(firstName.toLowerCase());
      const matchesLastName = !lastName || record.lastName.toLowerCase().includes(lastName.toLowerCase());
      const matchesCompany = !company || record.company.toLowerCase().includes(company.toLowerCase());
      const matchesUsername = !username || record.username.toLowerCase().includes(username.toLowerCase());

      return matchesFirstName && matchesLastName && matchesCompany && matchesUsername;
    });
  }, [loginData, firstName, lastName, company, username]);

  // Apply sorting
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortField === 'datetime') {
        aValue = new Date(a.datetime).getTime();
        bValue = new Date(b.datetime).getTime();
      } else {
        aValue = a[sortField].toLowerCase();
        bValue = b[sortField].toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortField, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    );
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
    <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/10">
        <div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: "'Noto Serif', serif" }}>
            User Login Data
          </CardTitle>
          {/* <CardDescription className="mt-1">
            All login records ({sortedData.length.toLocaleString()} {sortedData.length === 1 ? 'entry' : 'entries'})
          </CardDescription> */}
        </div>
      </CardHeader>

      <CardContent>
        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 mt-6">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <tr>
                <th
                  onClick={() => handleSort('datetime')}
                  className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    Login Time
                    {getSortIcon('datetime')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('username')}
                  className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    Username
                    {getSortIcon('username')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('firstName')}
                  className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    First Name
                    {getSortIcon('firstName')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('lastName')}
                  className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    Last Name
                    {getSortIcon('lastName')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('company')}
                  className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    Company
                    {getSortIcon('company')}
                  </div>
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
                    className={`border-b border-slate-100 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <td className="p-3 text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatDateTime(record.datetime)}
                    </td>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[200px] inline-block font-medium" title={record.username}>
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
        {sortedData.length > 0 && (
          <div className="flex items-center justify-between mt-6 px-2 py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Showing <span className="font-bold text-blue-600 dark:text-blue-400">{startIndex + 1}</span> to <span className="font-bold text-blue-600 dark:text-blue-400">{Math.min(endIndex, sortedData.length)}</span> of <span className="font-bold text-blue-600 dark:text-blue-400">{sortedData.length.toLocaleString()}</span> entries
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-300 dark:disabled:hover:border-slate-600 transition-all"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-300 dark:disabled:hover:border-slate-600 transition-all"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2 mx-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-300 dark:disabled:hover:border-slate-600 transition-all"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-300 dark:disabled:hover:border-slate-600 transition-all"
                title="Last page"
              >
                <ChevronsRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
