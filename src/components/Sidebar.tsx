"use client";

import { RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import logoSvg from "@/assets/certLogoTaglineSM2optColor.svg";
import ahriLogo from "@/assets/ahrilogo.svg";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { useFilterStore } from "@/store/filterStore";
import { useDataStore } from "@/store/dataStore";
import { useState, useMemo } from "react";

type TabKey =
  | "company-analysis"
  | "user-analysis"
  | "time-analysis"
  | "data-table"
  | "query-activity"
  | "all-licensees";

interface SidebarProps {
  className?: string;
  activeTab?: TabKey;
}

export function Sidebar({ className, activeTab = "time-analysis" }: SidebarProps) {
  const companyData = useAnalyticsStore(state => state.companyData);
  const { licenseeData } = useDataStore();
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const {
    startDate,
    endDate,
    selectedCompanies,
    searchUsername,
    firstName,
    lastName,
    company,
    username,
    year,
    program,
    oemName,
    status,
    email,
    setStartDate,
    setEndDate,
    toggleCompany,
    setSearchUsername,
    setFirstName,
    setLastName,
    setCompany,
    setUsername,
    setYear,
    setProgram,
    setOemName,
    setStatus,
    setEmail,
    resetFilters
  } = useFilterStore();

  // Extract unique values for All Licensees filters
  const uniqueOEMs = useMemo(() => {
    const oems = Array.from(new Set(licenseeData.map(item => item["OEM Name"]))).filter(Boolean);
    return oems.sort();
  }, [licenseeData]);

  const uniquePrograms = useMemo(() => {
    const programs = Array.from(new Set(licenseeData.map(item => item.Program))).filter(Boolean);
    return programs.sort();
  }, [licenseeData]);

  const uniqueStatuses = useMemo(() => {
    const statuses = Array.from(new Set(licenseeData.map(item => item.Status))).filter(Boolean);
    return statuses.sort();
  }, [licenseeData]);

  // Sort companies alphabetically
  const sortedCompanies = [...companyData].sort((a, b) =>
    a.company.localeCompare(b.company)
  );

  return (
    <aside
      className={cn(
        "w-64 flex-shrink-0 h-screen flex flex-col overflow-hidden",
        "bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900",
        "border-r border-slate-300 dark:border-slate-700 shadow-lg",
        "relative z-20 pointer-events-auto",
        className
      )}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b-2 border-slate-300 dark:border-slate-700 bg-gradient-to-br from-white/50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/20">
        <div className="flex justify-center mb-2">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-md">
            <img
              src={ahriLogo}
              alt="AHRI Logo"
              className="h-22 w-65"
            />
          </div>
        </div>
        {/* <h3 className="text-center text-sm font-bold bg-gradient-to-r from-slate-700 to-blue-600 dark:from-slate-300 dark:to-blue-400 bg-clip-text text-transparent">
          Analytics Filters
        </h3> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-5 custom-scrollbar">
        {/* Filter Section Title */}
        <div className="px-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400"></div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {activeTab === "data-table" && "User Data Filters"}
              {activeTab === "all-licensees" && "Licensee Filters"}
              {activeTab === "query-activity" && "Query Filters"}
              {!["data-table", "all-licensees", "query-activity"].includes(activeTab) && "Analysis Filters"}
            </h4>
          </div>
          <div className="h-px bg-gradient-to-r from-blue-400/50 via-blue-600/50 to-transparent dark:from-blue-600/50 dark:via-blue-400/50"></div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Data Table Filters */}
          {activeTab === "data-table" && (
            <>
              {/* First Name */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full px-4 py-2.5 text-sm rounded-lg
                               bg-white dark:bg-slate-800
                               border-2 border-slate-300 dark:border-slate-600
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               hover:border-slate-400 dark:hover:border-slate-500
                               transition-all duration-200
                               placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  {firstName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="w-full px-4 py-2.5 text-sm rounded-lg
                               bg-white dark:bg-slate-800
                               border-2 border-slate-300 dark:border-slate-600
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               hover:border-slate-400 dark:hover:border-slate-500
                               transition-all duration-200
                               placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  {lastName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Company */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  Company
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter company name"
                    className="w-full px-4 py-2.5 text-sm rounded-lg
                               bg-white dark:bg-slate-800
                               border-2 border-slate-300 dark:border-slate-600
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               hover:border-slate-400 dark:hover:border-slate-500
                               transition-all duration-200
                               placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  {company && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full px-4 py-2.5 text-sm rounded-lg
                               bg-white dark:bg-slate-800
                               border-2 border-slate-300 dark:border-slate-600
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               hover:border-slate-400 dark:hover:border-slate-500
                               transition-all duration-200
                               placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  {username && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* All Licensees Filters */}
          {activeTab === "all-licensees" && (
            <>
              {/* Program */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  Program
                </label>
                <div className="relative">
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg appearance-none
                               bg-white dark:bg-slate-800
                               border-2 border-slate-300 dark:border-slate-600
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               hover:border-slate-400 dark:hover:border-slate-500
                               transition-all duration-200
                               cursor-pointer"
                  >
                    <option value="">All Programs</option>
                    {uniquePrograms.map((prog, index) => (
                      <option key={index} value={prog}>{prog}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  {program && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>

              {/* OEM Name */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  OEM Name
                </label>
                <div className="relative">
                  <select
                    value={oemName}
                    onChange={(e) => setOemName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg appearance-none
                               bg-white dark:bg-slate-800
                               border-2 border-slate-300 dark:border-slate-600
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               hover:border-slate-400 dark:hover:border-slate-500
                               transition-all duration-200
                               cursor-pointer"
                  >
                    <option value="">All OEMs</option>
                    {uniqueOEMs.map((oem, index) => (
                      <option key={index} value={oem}>{oem}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  {oemName && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg appearance-none
                               bg-white dark:bg-slate-800
                               border-2 border-slate-300 dark:border-slate-600
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               hover:border-slate-400 dark:hover:border-slate-500
                               transition-all duration-200
                               cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((stat, index) => (
                      <option key={index} value={stat}>{stat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  {status && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Year */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  Year
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Enter year (e.g. 2024)"
                    className="w-full px-4 py-2.5 text-sm rounded-lg
                               bg-white dark:bg-slate-800
                               border-2 border-slate-300 dark:border-slate-600
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               hover:border-slate-400 dark:hover:border-slate-500
                               transition-all duration-200
                               placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  {year && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Query Activity Filters */}
          {activeTab === "query-activity" && (
            <>
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

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full px-3 py-2 text-sm rounded-lg
                             bg-white dark:bg-slate-900
                             border border-slate-300 dark:border-slate-600
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Default Filters (for other tabs) */}
          {!["data-table", "all-licensees", "query-activity"].includes(activeTab) && (
            <>
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

              {/* Select Companies - Multi Select (hidden for time-analysis) */}
              {activeTab !== "time-analysis" && (
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
              )}

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
            </>
          )}


          {/* Reset Filters Button */}
          <div className="pt-4">
            <button
              onClick={resetFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                         bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600
                         text-slate-700 dark:text-slate-200 font-semibold text-sm
                         shadow-md hover:shadow-lg
                         transform hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-200
                         border-2 border-slate-300 dark:border-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t-2 border-slate-300 dark:border-slate-700 bg-gradient-to-br from-white/50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/20">
        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
          <img
            src={logoSvg}
            alt="AHRI Logo"
            className="w-full h-auto"
            style={{ filter: "brightness(0.9)" }}
          />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #94a3b8, #64748b);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #64748b, #475569);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #475569, #334155);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #334155, #1e293b);
        }
      `}</style>
    </aside>
  );
}
