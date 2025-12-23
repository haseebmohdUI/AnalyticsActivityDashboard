import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, TrendingUp, Activity, Users, Calendar } from 'lucide-react';

interface QueryOperation {
  operation: string;
  count: number;
  uniqueUsers: number;
  firstQuery: string;
  lastQuery: string;
}

export function QueryAnalysisChart() {
  // Real query data from CSV
  const queryData: QueryOperation[] = useMemo(() => [
    { operation: 'FirstTestSummary', count: 5268, uniqueUsers: 211, firstQuery: '2022-02-07 19:06', lastQuery: '2025-12-18 14:32' },
    { operation: 'SelectionInfo', count: 4969, uniqueUsers: 62, firstQuery: '2022-02-08 22:35', lastQuery: '2025-12-18 02:54' },
    { operation: 'FailRateHistory', count: 3904, uniqueUsers: 86, firstQuery: '2022-02-08 22:36', lastQuery: '2025-12-18 14:31' },
    { operation: 'AuditQuery', count: 3900, uniqueUsers: 125, firstQuery: '2022-02-04 20:10', lastQuery: '2025-12-18 14:31' },
    { operation: 'RatingRatioArr', count: 3508, uniqueUsers: 82, firstQuery: '2022-02-07 19:19', lastQuery: '2025-12-18 14:32' },
    { operation: 'getRecordFromNextGenRenamed', count: 3035, uniqueUsers: 34, firstQuery: '2023-11-30 16:54', lastQuery: '2025-12-18 02:54' },
    { operation: 'ResultReportType', count: 2712, uniqueUsers: 56, firstQuery: '2022-02-08 22:35', lastQuery: '2025-12-17 01:17' },
    { operation: 'AllProgramFirstTestSummary', count: 2218, uniqueUsers: 201, firstQuery: '2022-02-07 19:06', lastQuery: '2025-12-18 02:52' },
    { operation: 'LocationAllProgramFirstTestSummary', count: 1316, uniqueUsers: 162, firstQuery: '2022-02-07 19:06', lastQuery: '2025-12-18 02:52' },
    { operation: 'getPublicNotification', count: 792, uniqueUsers: 115, firstQuery: '2022-03-02 19:19', lastQuery: '2025-12-18 16:06' },
    { operation: 'getDirectoryFilerItems', count: 351, uniqueUsers: 91, firstQuery: '2022-02-08 22:34', lastQuery: '2025-12-18 14:33' },
    { operation: 'DecisionSummary', count: 341, uniqueUsers: 76, firstQuery: '2022-02-07 19:16', lastQuery: '2025-12-18 14:32' },
    { operation: 'singleVarRecordPaginated', count: 295, uniqueUsers: 45, firstQuery: '2022-02-08 22:37', lastQuery: '2025-10-06 14:30' },
    { operation: 'getRecordSingleVarACS', count: 240, uniqueUsers: 45, firstQuery: '2022-02-08 22:37', lastQuery: '2025-10-06 14:30' },
    { operation: 'getAllEmployeeWithCeoAccess', count: 232, uniqueUsers: 124, firstQuery: '2022-02-09 17:03', lastQuery: '2025-12-18 14:33' },
    { operation: 'SelectedVariable', count: 185, uniqueUsers: 67, firstQuery: '2022-02-08 22:37', lastQuery: '2025-12-18 14:33' },
    { operation: 'ushpHspfEnforcePrediction', count: 180, uniqueUsers: 19, firstQuery: '2022-02-09 17:10', lastQuery: '2025-12-18 02:54' },
    { operation: 'ushpSeerEnforcePrediction', count: 176, uniqueUsers: 19, firstQuery: '2022-02-09 17:10', lastQuery: '2025-12-18 02:54' },
    { operation: 'ushpHspfPrediction', count: 174, uniqueUsers: 19, firstQuery: '2022-02-09 17:10', lastQuery: '2025-12-18 02:54' },
    { operation: 'ushpSeerPrediction', count: 174, uniqueUsers: 19, firstQuery: '2022-02-09 17:10', lastQuery: '2025-12-18 02:54' },
    { operation: 'updateUserCompanyAccess', count: 150, uniqueUsers: 32, firstQuery: '2022-02-14 21:48', lastQuery: '2025-09-04 18:06' },
    { operation: 'sendEmail', count: 150, uniqueUsers: 32, firstQuery: '2022-02-14 21:48', lastQuery: '2025-09-04 18:06' },
    { operation: 'singleVarRecordPaginatedOthers', count: 136, uniqueUsers: 29, firstQuery: '2022-02-08 22:38', lastQuery: '2025-10-06 14:30' },
    { operation: 'rwhUefenforcePrediction', count: 132, uniqueUsers: 12, firstQuery: '2022-02-08 22:35', lastQuery: '2025-08-06 15:46' },
    { operation: 'rwhUefPrediction', count: 129, uniqueUsers: 12, firstQuery: '2022-02-08 22:35', lastQuery: '2025-08-06 15:46' },
    { operation: 'getPageRecord', count: 123, uniqueUsers: 27, firstQuery: '2022-03-04 06:25', lastQuery: '2025-06-25 12:55' },
    { operation: 'usacSeerEnforcePrediction', count: 120, uniqueUsers: 15, firstQuery: '2022-02-11 16:35', lastQuery: '2025-12-03 16:56' },
    { operation: 'usacSeerPrediction', count: 120, uniqueUsers: 15, firstQuery: '2022-02-11 16:35', lastQuery: '2025-12-03 16:56' },
    { operation: 'getPageRecordSingleVarOthersHistogram', count: 66, uniqueUsers: 1, firstQuery: '2025-05-12 14:16', lastQuery: '2025-05-13 14:19' },
    { operation: 'rfrnAfueEnforcePrediction', count: 53, uniqueUsers: 13, firstQuery: '2022-02-09 17:18', lastQuery: '2025-12-05 15:20' },
    { operation: 'rfrnAfuePrediction', count: 53, uniqueUsers: 13, firstQuery: '2022-02-09 17:18', lastQuery: '2025-12-05 15:20' },
    { operation: 'AhriTestsWithDecisions', count: 41, uniqueUsers: 13, firstQuery: '2022-02-09 17:03', lastQuery: '2025-10-01 16:05' },
    { operation: 'getCompanyInfo', count: 35, uniqueUsers: 2, firstQuery: '2023-08-29 18:01', lastQuery: '2024-01-05 17:09' },
    { operation: 'getAllEmployeeInCompany', count: 30, uniqueUsers: 1, firstQuery: '2023-12-19 15:03', lastQuery: '2024-01-05 17:09' },
    { operation: 'uleIeerEnforcePrediction', count: 22, uniqueUsers: 9, firstQuery: '2022-05-03 14:14', lastQuery: '2025-11-19 02:57' },
    { operation: 'uleIeerPrediction', count: 22, uniqueUsers: 9, firstQuery: '2022-05-03 14:14', lastQuery: '2025-11-19 02:57' },
    { operation: 'getCompanyHierarchyStructured', count: 14, uniqueUsers: 2, firstQuery: '2023-08-29 18:00', lastQuery: '2024-01-10 21:21' },
    { operation: 'rblrAfuePrediction', count: 10, uniqueUsers: 6, firstQuery: '2022-06-29 17:06', lastQuery: '2025-05-23 12:53' },
    { operation: 'rblrAfueEnforcePrediction', count: 10, uniqueUsers: 6, firstQuery: '2022-06-29 17:06', lastQuery: '2025-05-23 12:53' },
    { operation: 'getPageRecordRange', count: 4, uniqueUsers: 3, firstQuery: '2022-02-08 22:39', lastQuery: '2022-04-08 21:04' },
    { operation: 'getRecord', count: 2, uniqueUsers: 1, firstQuery: '2023-04-30 14:33', lastQuery: '2023-04-30 14:33' },
    { operation: 'allParticipants', count: 1, uniqueUsers: 1, firstQuery: '2025-11-05 16:58', lastQuery: '2025-11-05 16:58' },
  ], []);

  const top15Operations = queryData.slice(0, 15);
  const top10Operations = queryData.slice(0, 10);

  // Generate colors
  const generateColors = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const hue = 210 + (i * 20) % 120;
      return `hsl(${hue}, 75%, 55%)`;
    });
  };

  const colors = generateColors(15);

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.operation}
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Query Count: <span className="font-bold">{payload[0].payload.count.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.operation}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Query Count:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.count.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Percentage:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{payload[0].payload.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalQueries = queryData.reduce((sum, q) => sum + q.count, 0);
  const top10Total = top10Operations.reduce((sum, q) => sum + q.count, 0);

  // Calculate metrics from data
  const uniqueOperations = queryData.length;
  const uniqueUsers = 298; // Total unique users across all operations

  // Calculate days span from earliest to latest query
  const allDates = queryData.flatMap(q => [new Date(q.firstQuery), new Date(q.lastQuery)]);
  const earliestDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const latestDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const daysSpan = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24));

  // Prepare pie chart data
  const pieData = top10Operations.map((item, index) => ({
    ...item,
    value: item.count,
    percentage: ((item.count / top10Total) * 100).toFixed(1),
    fill: colors[index]
  }));

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Query Analysis</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase">Total Queries</CardTitle>
            <Activity className="w-5 h-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQueries.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase">Unique Users</CardTitle>
            <Users className="w-5 h-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase">Unique Operations</CardTitle>
            <Database className="w-5 h-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueOperations}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase">Days Span</CardTitle>
            <Calendar className="w-5 h-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysSpan.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Bar Chart */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              <Database className="w-5 h-5" />
              Top 15 Operations by Query Count
            </CardTitle>
            <CardDescription>
              Most frequently executed operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={top15Operations}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 210, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    type="number"
                    domain={[0, 5000]}
                    tick={{ fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <YAxis
                    type="category"
                    dataKey="operation"
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    className="text-slate-600 dark:text-slate-400"
                    width={200}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="count"
                    name="Query Count"
                    radius={[0, 8, 8, 0]}
                  >
                    {top15Operations.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              <TrendingUp className="w-5 h-5" />
              Query Distribution (Top 10)
            </CardTitle>
            <CardDescription>
              Distribution of queries across top 10 operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.percentage}%`}
                    outerRadius={180}
                    innerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', maxHeight: '550px', overflowY: 'auto' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
