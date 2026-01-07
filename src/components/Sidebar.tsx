"use client";

import { LayoutDashboard, RotateCcw, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import logoSvg from "@/assets/certLogoTaglineSM2optColor.svg";
import ahriLogo from "@/assets/ahrilogo.svg";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { useFilterStore } from "@/store/filterStore";
import { useDataStore } from "@/store/dataStore";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const companyData = useAnalyticsStore(state => state.companyData);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const { fetchLoginDataPaginated, loginDataPagination, isLoginDataLoading } = useDataStore();

  const {
    startDate,
    endDate,
    selectedCompanies,
    searchUsername,
    pageSize,
    setStartDate,
    setEndDate,
    toggleCompany,
    setSearchUsername,
    setPageSize,
    setPage,
    resetFilters
  } = useFilterStore();

  const handlePageSizeChange = async (newPageSize: number) => {
    setPageSize(newPageSize);
    // Fetch new data with updated page size (reset to page 1)
    await fetchLoginDataPaginated({ page: 1, page_size: newPageSize }, false);
  };

  const handlePageChange = async (newPage: number) => {
    const totalPages = Math.ceil(loginDataPagination.totalRecords / pageSize);
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
    await fetchLoginDataPaginated({ page: newPage, page_size: pageSize }, false);
  };

  // Sort companies alphabetically
  const sortedCompanies = [...companyData].sort((a, b) =>
    a.company.localeCompare(b.company)
  );

  return (
    <aside
      className={cn(
        "w-64 flex-shrink-0 h-screen p-6 flex flex-col",
        "bg-gray-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800",
        "relative z-20 pointer-events-auto",
        className
      )}
    >
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex justify-center mb-3">
          <img
            src={ahriLogo}
            alt="AHRI Logo"
            className="h-20 w-30"
          />
        </div>
        {/* <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">
          Analytics App
        </p> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6">
        {/* Dashboard */}
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                     bg-gradient-to-r from-slate-600 to-blue-600
                     text-white shadow-lg"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium text-sm">Dashboard</span>
        </button>

        {/* Filters */}
        <div className="space-y-4 px-2">
          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Select Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                className="w-full px-3 py-2 text-sm rounded-lg
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                className="w-full px-3 py-2 text-sm rounded-lg
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Select Companies - Multi Select */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Select Companies ({selectedCompanies.length} selected)
            </label>
            <button
              type="button"
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="w-full px-3 py-2 text-sm rounded-lg text-left
                         bg-white dark:bg-slate-900
                         border border-slate-300 dark:border-slate-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         flex items-center justify-between"
            >
              <span className="truncate">
                {selectedCompanies.length === 0
                  ? "All Companies"
                  : selectedCompanies.length === 1
                  ? selectedCompanies[0]
                  : `${selectedCompanies.length} companies selected`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCompanyDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {sortedCompanies.map((company, index) => (
                  <label
                    key={index}
                    className="flex items-center px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company.company)}
                      onChange={() => toggleCompany(company.company)}
                      className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm truncate">{company.company}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Search Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Search Username
            </label>
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-3 py-2 text-sm rounded-lg
                         bg-white dark:bg-slate-900
                         border border-slate-300 dark:border-slate-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Page Size Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Records Per Page
            </label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg
                         bg-white dark:bg-slate-900
                         border border-slate-300 dark:border-slate-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         cursor-pointer"
            >
              <option value={100}>100 records</option>
              <option value={200}>200 records</option>
              <option value={300}>300 records</option>
              <option value={400}>400 records</option>
              <option value={500}>500 records</option>
            </select>
          </div>

          {/* Pagination Display */}
          {loginDataPagination.totalRecords > 0 && (() => {
            const totalPages = Math.ceil(loginDataPagination.totalRecords / pageSize);
            const currentPage = loginDataPagination.currentPage;
            const displayedRecords = Math.min(currentPage * pageSize, loginDataPagination.totalRecords);
            const remainingRecords = loginDataPagination.totalRecords - displayedRecords;

            return (
              <div className="space-y-3">
                {/* Page Info */}
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800">
                  <div className="text-center mb-2">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      Page <span className="text-blue-600 dark:text-blue-400 text-lg">{currentPage}</span> of{' '}
                      <span className="text-blue-600 dark:text-blue-400 text-lg">{totalPages}</span>
                    </p>
                  </div>
                  <div className="text-xs text-center text-slate-700 dark:text-slate-300 space-y-1">
                    <p>
                      Showing <span className="font-bold text-blue-600 dark:text-blue-400">{displayedRecords.toLocaleString()}</span> of{' '}
                      <span className="font-bold">{loginDataPagination.totalRecords.toLocaleString()}</span> records
                    </p>
                    {remainingRecords > 0 && (
                      <p className="text-amber-600 dark:text-amber-400 font-medium">
                        {remainingRecords.toLocaleString()} remaining
                      </p>
                    )}
                  </div>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoginDataLoading}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => {
                      const page = Number(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    min={1}
                    max={totalPages}
                    className="w-16 px-2 py-1 text-center text-sm rounded-lg
                               bg-white dark:bg-slate-900
                               border border-slate-300 dark:border-slate-600
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoginDataLoading}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Reset Filters Button */}
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                         bg-slate-100 dark:bg-slate-800
                         text-slate-700 dark:text-slate-300
                         border border-slate-300 dark:border-slate-600
                         hover:bg-slate-200 dark:hover:bg-slate-700
                         hover:border-slate-400 dark:hover:border-slate-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         transition-all duration-200
                         font-medium text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <img
          src={logoSvg}
          alt="AHRI Logo"
          className="w-full h-auto"
          style={{ filter: "brightness(0.9)" }}
        />
      </div>
    </aside>
  );
}
