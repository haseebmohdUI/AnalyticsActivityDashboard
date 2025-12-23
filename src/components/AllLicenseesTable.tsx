"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Filter, Building2, Award, CheckCircle } from "lucide-react";
import allLicenseesData from "@/store/AllLicenseesRawData.json";

interface LicenseeData {
  "OEM Name": string;
  "OEM ORG ID": string;
  "PBM Name": string;
  "PBM ORG ID": string;
  "Program": string;
  "Status": string;
  "Total Active & PS": number;
  "Active": number;
  "Production Stopped": number;
  "Discontinued": number;
  "Obsolete (min and other)": number;
  "total_tests": string | number;
  "fail_rate": string | number;
}

export function AllLicenseesTable() {
  const [selectedOEM, setSelectedOEM] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const licenseeData = allLicenseesData as LicenseeData[];

  // Extract unique values for filters
  const uniqueOEMs = useMemo(() => {
    const oems = Array.from(new Set(licenseeData.map(item => item["OEM Name"]))).filter(Boolean);
    return oems.sort();
  }, []);

  const uniquePrograms = useMemo(() => {
    const programs = Array.from(new Set(licenseeData.map(item => item.Program))).filter(Boolean);
    return programs.sort();
  }, []);

  const uniqueStatuses = useMemo(() => {
    const statuses = Array.from(new Set(licenseeData.map(item => item.Status))).filter(Boolean);
    return statuses.sort();
  }, []);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return licenseeData.filter(item => {
      const matchesOEM = !selectedOEM || item["OEM Name"] === selectedOEM;
      const matchesProgram = !selectedProgram || item.Program === selectedProgram;
      const matchesStatus = !selectedStatus || item.Status === selectedStatus;
      return matchesOEM && matchesProgram && matchesStatus;
    });
  }, [selectedOEM, selectedProgram, selectedStatus]);

  const resetFilters = () => {
    setSelectedOEM("");
    setSelectedProgram("");
    setSelectedStatus("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">All Licensees</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Showing {filteredData.length} of {licenseeData.length} licensees
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter the licensee data by OEM, Program, and Status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Filter by OEM */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <Building2 className="w-3 h-3 inline mr-1" />
                Filter by OEM
              </label>
              <select
                value={selectedOEM}
                onChange={(e) => setSelectedOEM(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All OEMs</option>
                {uniqueOEMs.map((oem, index) => (
                  <option key={index} value={oem}>
                    {oem}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Program */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <Award className="w-3 h-3 inline mr-1" />
                Filter by Program
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Programs</option>
                {uniquePrograms.map((program, index) => (
                  <option key={index} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg
                           bg-white dark:bg-slate-900
                           border border-slate-300 dark:border-slate-600
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 text-sm font-medium rounded-lg
                           bg-slate-100 dark:bg-slate-800
                           text-slate-700 dark:text-slate-300
                           border border-slate-300 dark:border-slate-600
                           hover:bg-slate-200 dark:hover:bg-slate-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Licensee Data</CardTitle>
          <CardDescription>
            Comprehensive view of all licensees and their program participation
          </CardDescription>
        </CardHeader>
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
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No data found matching the selected filters
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
