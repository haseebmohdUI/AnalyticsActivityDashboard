"use client";

import { useState } from "react";
import { UserProfile } from "./UserProfile";
import { Sidebar } from "./Sidebar";
import { CompanyAnalysisChart } from "./CompanyAnalysisChart";
import { TimeAnalysisChart } from "./TimeAnalysisChart";
import { UserAnalysisChart } from "./UserAnalysisChart";
import { DataTable } from "./DataTable";
import { QueryAnalysisChart } from "./QueryAnalysisChart";
import { AllLicenseesTable } from "./AllLicenseesTable";
import { OEMPMBAnalysisChart } from "./OEMPMBAnalysisChart";
import { ACSParticipantAnalysisChart } from "./ACSParticipantAnalysisChart";
import { DataErrorBanner } from "./DataErrorBanner";
import { useDataStore } from "@/store/dataStore";

type TabKey =
  | "company-analysis"
  | "user-analysis"
  | "time-analysis"
  | "data-table"
  | "query-activity"
  | "all-licensees"
  | "oem-pmb-analysis"
  | "acs-participant-analysis";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("time-analysis");

  // Get data from store
  const { errors, isDataFromFallback, clearErrors } = useDataStore();

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
    <div className="flex">
      <Sidebar activeTab={activeTab} />
      <main className="flex-1 h-screen overflow-auto bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Analytics User Activity Dashboard
            </h1>
            <UserProfile />
          </div>
        </header>

      <div className="p-6">
        {/* Error Banner */}
        <DataErrorBanner
          errors={errors}
          isFromFallback={isDataFromFallback}
          onDismiss={clearErrors}
        />

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabButton("time-analysis", "Time Analysis")}
          {tabButton("user-analysis", "User Analysis")}
          {tabButton("company-analysis", "Company Analysis")}
          {tabButton("data-table", "Data Table")}
          {tabButton("query-activity", "Query Activity")}
          {tabButton("all-licensees", "All Licensees")}
          {tabButton("oem-pmb-analysis", "OEM/PMB Analysis")}
          {tabButton("acs-participant-analysis", "ACS Participant Analysis")}
        </div>

        {/* Tab Content */}
        {activeTab === "time-analysis" && <TimeAnalysisChart />}
        {activeTab === "user-analysis" && <UserAnalysisChart />}
        {activeTab === "company-analysis" && <CompanyAnalysisChart />}
        {activeTab === "data-table" && <DataTable />}
        {activeTab === "query-activity" && <QueryAnalysisChart />}
        {activeTab === "all-licensees" && <AllLicenseesTable />}
        {activeTab === "oem-pmb-analysis" && <OEMPMBAnalysisChart />}
        {activeTab === "acs-participant-analysis" && <ACSParticipantAnalysisChart />}
      </div>
    </main>
    </div>
  );
}
