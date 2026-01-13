"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Award, Database, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useDataStore } from "@/store/dataStore";
import { useFilterStore } from "@/store/filterStore";

export function AllLicenseesTable() {
  // Get licensee data from store
  const { licenseeData } = useDataStore();

  // Get filters from filter store
  const { oemName, program, status } = useFilterStore();

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Extract unique values for filters
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

  // Filter data based on selected filters from sidebar
  const filteredData = useMemo(() => {
    const filtered = licenseeData.filter(item => {
      const matchesOEM = !oemName || item["OEM Name"]?.toLowerCase().includes(oemName.toLowerCase());
      const matchesProgram = !program || item.Program?.toLowerCase().includes(program.toLowerCase());
      const matchesStatus = !status || item.Status?.toLowerCase().includes(status.toLowerCase());
      return matchesOEM && matchesProgram && matchesStatus;
    });
    // Reset to page 1 when filters change
    setCurrentPage(1);
    return filtered;
  }, [licenseeData, oemName, program, status]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);


  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRecords = licenseeData.length;
    const uniqueOEMsCount = uniqueOEMs.length;
    const uniqueProgramsCount = uniquePrograms.length;

    // Calculate total tests (sum of total_tests field)
    const totalTests = licenseeData.reduce((sum, item) => {
      const tests = typeof item.total_tests === 'number' ? item.total_tests :
                    (item.total_tests ? parseInt(String(item.total_tests)) : 0);
      return sum + (isNaN(tests) ? 0 : tests);
    }, 0);

    return {
      totalRecords,
      uniqueOEMs: uniqueOEMsCount,
      uniquePrograms: uniqueProgramsCount,
      totalTests
    };
  }, [licenseeData, uniqueOEMs, uniquePrograms]);

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">All Licensees</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Showing {filteredData.length} of {licenseeData.length} licensees
        </p>
      </div> */}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Total Records</p>
          </div>
          <p className="relative text-3xl font-bold text-blue-600 dark:text-blue-400">{metrics.totalRecords.toLocaleString()}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-purple-50 via-purple-100/50 to-pink-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Unique OEMs</p>
          </div>
          <p className="relative text-3xl font-bold text-purple-600 dark:text-purple-400">{metrics.uniqueOEMs.toLocaleString()}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-50 via-green-100/50 to-emerald-50 dark:from-green-900/30 dark:via-green-800/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 hover:border-green-400 dark:hover:border-green-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/5 group-hover:to-green-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-xs font-semibold text-green-900 dark:text-green-300">Programs</p>
          </div>
          <p className="relative text-3xl font-bold text-green-600 dark:text-green-400">{metrics.uniquePrograms.toLocaleString()}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-700/50 hover:border-orange-400 dark:hover:border-orange-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 to-orange-600/0 group-hover:from-orange-400/5 group-hover:to-orange-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="text-xs font-semibold text-orange-900 dark:text-orange-300">Total ACS Tests</p>
          </div>
          <p className="relative text-3xl font-bold text-orange-600 dark:text-orange-400">{metrics.totalTests.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border-slate-200 dark:border-slate-800 shadow-xl">
        {/* <CardHeader className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/10">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: "'Noto Serif', serif" }}>
            Licensee Data
          </CardTitle>
          <CardDescription className="mt-1 text-sm">
            Comprehensive view of all licensees and their program participation
          </CardDescription>
        </CardHeader> */}
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    OEM Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    OEM ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    PBM Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Program
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    Active
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    Production Stopped
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    Discontinued
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    Total Tests
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    Fail Rate (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No data found matching the selected filters
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                        {item["OEM Name"]}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {item["OEM ORG ID"]}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {item["PBM Name"] || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-xs">
                          {item.Program}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium text-xs">
                          {item.Status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-900 dark:text-slate-100 font-semibold">
                        {item.Active.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                        {item["Production Stopped"].toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                        {item.Discontinued.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                        {item.total_tests || "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                        {item.fail_rate ? `${Number(item.fail_rate).toFixed(2)}%` : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-4 py-2 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
