"use client";

import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import logoSvg from "@/assets/certLogoTaglineSM2optColor.svg";
import { useAnalyticsStore } from "@/store/analyticsStore";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const companyData = useAnalyticsStore(state => state.companyData);

  // Sort companies alphabetically
  const sortedCompanies = [...companyData].sort((a, b) =>
    a.company.localeCompare(b.company)
  );

  return (
    <aside
      className={cn(
        "w-64 flex-shrink-0 h-screen p-6 flex flex-col",
        "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800",
        "relative z-20 pointer-events-auto",
        className
      )}
    >
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h1
          className="text-4xl font-black tracking-tight text-center"
          style={{
            background: "linear-gradient(135deg,#64748b,#006aff,#0080ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AHRI
        </h1>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-3 text-center">
          Analytics App
        </p>
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
                className="w-full px-3 py-2 text-sm rounded-lg
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <div className="text-xs text-slate-500 dark:text-slate-400 text-center">to</div> */}
              <input
                type="date"
                className="w-full px-3 py-2 text-sm rounded-lg
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Select Companies */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Select Companies
            </label>
            <select
              className="w-full px-3 py-2 text-sm rounded-lg
                         bg-white dark:bg-slate-900
                         border border-slate-300 dark:border-slate-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Companies</option>
              {sortedCompanies.map((company, index) => (
                <option key={index} value={company.company}>
                  {company.company}
                </option>
              ))}
            </select>
          </div>

          {/* Search Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Search Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full px-3 py-2 text-sm rounded-lg
                         bg-white dark:bg-slate-900
                         border border-slate-300 dark:border-slate-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
