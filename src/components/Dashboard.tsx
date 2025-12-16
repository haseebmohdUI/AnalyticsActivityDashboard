import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Activity, BarChart3, Calendar } from 'lucide-react';
import { UserProfile } from './UserProfile';
import { CompanyAnalysisChart } from './CompanyAnalysisChart';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <Card className="hover:shadow-lg hover:scale-[1.01] transition-all duration-200 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border-slate-200 dark:border-slate-700 overflow-hidden group">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
        background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.05) 0%, rgba(0, 106, 255, 0.08) 60%, rgba(0, 128, 255, 0.05) 100%)'
      }} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3 px-4 relative">
        <CardTitle className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide" style={{ fontFamily: "'Raleway', sans-serif" }}>
          {title}
        </CardTitle>
        <div className="p-1.5 rounded-lg text-[#006aff] dark:text-[#0080ff]" style={{
          background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(0, 106, 255, 0.15) 60%, rgba(0, 128, 255, 0.1) 100%)'
        }}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative px-4 pb-3">
        <div className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("company-analysis");

  return (
    <main className="flex-1 h-screen overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-2 sticky top-0 z-10">
        <div className="flex items-center justify-end">
          <UserProfile />
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Overall Activity */}
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>Overall Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Logins"
              value="4,060"
              icon={<Activity className="w-5 h-5" />}
            />
            <MetricCard
              title="Unique Users"
              value="298"
              icon={<Users className="w-5 h-5" />}
            />
            <MetricCard
              title="Companies"
              value="218"
              icon={<BarChart3 className="w-5 h-5" />}
            />
            <MetricCard
              title="Days Span"
              value="1,728"
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-5">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 shadow-lg flex-wrap gap-1">
          <TabsTrigger value="company-analysis" className="data-[state=active]:text-white" style={{"--active-gradient": "linear-gradient(135deg, #475569 0%, #006aff 100%)"} as any}>
              Company Analysis
            </TabsTrigger>
            <TabsTrigger value="user-analysis" className="data-[state=active]:text-white" style={{"--active-gradient": "linear-gradient(135deg, #475569 0%, #006aff 100%)"} as any}>
              User Analysis
            </TabsTrigger>
            <TabsTrigger value="time-analysis" className="data-[state=active]:text-white" style={{"--active-gradient": "linear-gradient(135deg, #475569 0%, #006aff 100%)"} as any}>
              Time Analysis
            </TabsTrigger>
            
            <TabsTrigger value="data-table" className="data-[state=active]:text-white" style={{"--active-gradient": "linear-gradient(135deg, #475569 0%, #006aff 100%)"} as any}>
              Data Table
            </TabsTrigger>
            <TabsTrigger value="query-activity" className="data-[state=active]:text-white" style={{"--active-gradient": "linear-gradient(135deg, #475569 0%, #006aff 100%)"} as any}>
              Query Activity
            </TabsTrigger>
            <TabsTrigger value="all-licensees" className="data-[state=active]:text-white" style={{"--active-gradient": "linear-gradient(135deg, #475569 0%, #006aff 100%)"} as any}>
              All Licensees
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user-analysis" className="mt-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>User Analysis</CardTitle>
                <CardDescription>Comprehensive user behavior and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #475569 0%, #006aff 100%)'
                    }}>
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold mb-2">User Analysis Visualization</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      User engagement charts, login patterns, and activity metrics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time-analysis" className="mt-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>Time Analysis</CardTitle>
                <CardDescription>Time-based trends and temporal patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #475569 0%, #006aff 100%)'
                    }}>
                      <Activity className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold mb-2">Time Analysis Visualization</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Hourly, daily, weekly and monthly activity trends
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company-analysis" className="mt-6">
            <CompanyAnalysisChart />
          </TabsContent>

          <TabsContent value="data-table" className="mt-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>Data Table</CardTitle>
                <CardDescription>Detailed tabular view of all data points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #475569 0%, #006aff 100%)'
                    }}>
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold mb-2">Data Table View</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Sortable and filterable data grid
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="query-activity" className="mt-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>Query Activity</CardTitle>
                <CardDescription>Query performance and activity monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #475569 0%, #006aff 100%)'
                    }}>
                      <Activity className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold mb-2">Query Activity Visualization</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Query volume, response times, and success rates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-licensees" className="mt-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>All Licensees</CardTitle>
                <CardDescription>Complete licensee directory and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #475569 0%, #006aff 100%)'
                    }}>
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold mb-2">All Licensees View</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Licensee list with status and activity information
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>


        {/* Main Visualization */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Analytics Overview
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Comprehensive data visualization and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #475569 0%, #006aff 100%)'
                }}>
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold mb-2">Main Chart Visualization</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Integrate with Chart.js, Recharts, or D3.js for interactive charts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
