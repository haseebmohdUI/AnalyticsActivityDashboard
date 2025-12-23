"use client";

import { LayoutDashboard, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import logoSvg from "@/assets/certLogoTaglineSM2optColor.svg";
import ahriLogo from "@/assets/ahrilogo.svg";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { useFilterStore } from "@/store/filterStore";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const companyData = useAnalyticsStore(state => state.companyData);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const {
    startDate,
    endDate,
    selectedCompanies,
    searchUsername,
    setStartDate,
    setEndDate,
    toggleCompany,
    setSearchUsername,
    resetFilters
  } = useFilterStore();

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
