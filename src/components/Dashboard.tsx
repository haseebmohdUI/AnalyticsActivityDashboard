"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, BarChart3, Calendar } from "lucide-react";
import { UserProfile } from "./UserProfile";
import { CompanyAnalysisChart } from "./CompanyAnalysisChart";
import { TimeAnalysisChart } from "./TimeAnalysisChart";
import { UserAnalysisChart } from "./UserAnalysisChart";
import { DataTable } from "./DataTable";
import { QueryAnalysisChart } from "./QueryAnalysisChart";
import { AllLicenseesTable } from "./AllLicenseesTable";
import { useFilterStore } from "@/store/filterStore";
import { filterRawData, aggregateCompanyData } from "@/utils/dataFilters";

type TabKey =
  | "company-analysis"
  | "user-analysis"
  | "time-analysis"
  | "data-table"
  | "query-activity"
  | "all-licensees";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs uppercase">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("time-analysis");
  const { startDate, endDate, selectedCompanies, searchUsername } = useFilterStore();

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    const filteredData = filterRawData(startDate, endDate, selectedCompanies, searchUsername);
    const companyData = aggregateCompanyData(filteredData);
    const uniqueUsers = new Set(filteredData.map(r => r.username));

    // Calculate days span
    if (filteredData.length === 0) {
      return {
        totalLogins: 0,
        uniqueUsers: 0,
        companies: 0,
        daysSpan: 0
      };
    }

    const dates = filteredData.map(r => new Date(r.datetime).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const daysSpan = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

    return {
      totalLogins: filteredData.length,
      uniqueUsers: uniqueUsers.size,
      companies: companyData.length,
      daysSpan: daysSpan
    };
  }, [startDate, endDate, selectedCompanies, searchUsername]);

  const tabButton = (key: TabKey, label: string) => (
    <button
      onClick={() => setActiveTab(key)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition
        ${
          activeTab === key
            ? "bg-gradient-to-r from-slate-600 to-blue-600 text-white"
            : "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
        }`}
    >
      {label}
    </button>
  );

  return (
    <main className="flex-1 h-screen overflow-auto bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b px-6 py-2">
        <div className="flex justify-end">
          <UserProfile />
        </div>
      </header>

      <div className="p-6">
        {/* Metrics */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Logins" value={metrics.totalLogins.toLocaleString()} icon={<Activity />} />
          <MetricCard title="Unique Users" value={metrics.uniqueUsers.toLocaleString()} icon={<Users />} />
          <MetricCard title="Companies" value={metrics.companies.toLocaleString()} icon={<BarChart3 />} />
          <MetricCard title="Days Span" value={metrics.daysSpan.toLocaleString()} icon={<Calendar />} />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabButton("time-analysis", "Time Analysis")}
          {tabButton("user-analysis", "User Analysis")}
          {tabButton("company-analysis", "Company Analysis")}
          {tabButton("data-table", "Data Table")}
          {tabButton("query-activity", "Query Activity")}
          {tabButton("all-licensees", "All Licensees")}
        </div>

        {/* Tab Content */}
        {activeTab === "time-analysis" && <TimeAnalysisChart />}
        {activeTab === "user-analysis" && <UserAnalysisChart />}
        {activeTab === "company-analysis" && <CompanyAnalysisChart />}
        {activeTab === "data-table" && <DataTable />}
        {activeTab === "query-activity" && <QueryAnalysisChart />}
        {activeTab === "all-licensees" && <AllLicenseesTable />}
      </div>
    </main>
  );
}
