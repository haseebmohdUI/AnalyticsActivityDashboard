"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, BarChart3, Calendar } from "lucide-react";
import { UserProfile } from "./UserProfile";
import { CompanyAnalysisChart } from "./CompanyAnalysisChart";
import { TimeAnalysisChart } from "./TimeAnalysisChart";
import { UserAnalysisChart } from "./UserAnalysisChart";
import { DataTable } from "./DataTable";
import { QueryAnalysisChart } from "./QueryAnalysisChart";

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
  const [activeTab, setActiveTab] = useState<TabKey>("company-analysis");

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
          <MetricCard title="Total Logins" value="4,060" icon={<Activity />} />
          <MetricCard title="Unique Users" value="298" icon={<Users />} />
          <MetricCard title="Companies" value="218" icon={<BarChart3 />} />
          <MetricCard title="Days Span" value="1,728" icon={<Calendar />} />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabButton("company-analysis", "Company Analysis")}
          {tabButton("user-analysis", "User Analysis")}
          {tabButton("time-analysis", "Time Analysis")}
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

        {activeTab === "all-licensees" && (
          <Card>
            <CardHeader>
              <CardTitle>All Licensees</CardTitle>
              <CardDescription>Licensee directory</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              All Licensees Content
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
