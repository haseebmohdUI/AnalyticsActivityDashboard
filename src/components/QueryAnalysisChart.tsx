import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, TrendingUp, Activity } from 'lucide-react';

interface QueryOperation {
  operation: string;
  count: number;
}

export function QueryAnalysisChart() {
  // Generate mock query data based on realistic API/database operations
  const queryData: QueryOperation[] = useMemo(() => [
    { operation: 'GET /api/users', count: 1250 },
    { operation: 'POST /api/login', count: 1180 },
    { operation: 'GET /api/dashboard', count: 980 },
    { operation: 'GET /api/companies', count: 856 },
    { operation: 'POST /api/logout', count: 742 },
    { operation: 'GET /api/analytics', count: 628 },
    { operation: 'PUT /api/users/profile', count: 485 },
    { operation: 'GET /api/reports', count: 412 },
    { operation: 'POST /api/data/export', count: 358 },
    { operation: 'GET /api/settings', count: 294 },
    { operation: 'DELETE /api/sessions', count: 246 },
    { operation: 'GET /api/logs', count: 198 },
    { operation: 'POST /api/notifications', count: 165 },
    { operation: 'PUT /api/preferences', count: 124 },
    { operation: 'GET /api/activity', count: 89 },
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
  const top15Total = top15Operations.reduce((sum, q) => sum + q.count, 0);
  const top10Total = top10Operations.reduce((sum, q) => sum + q.count, 0);

  // Prepare pie chart data
  const pieData = top10Operations.map((item, index) => ({
    ...item,
    value: item.count,
    percentage: ((item.count / top10Total) * 100).toFixed(1),
    fill: colors[index]
  }));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Total Operations</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{queryData.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200 dark:border-purple-800">
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">Total Queries</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalQueries.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800">
          <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">Avg Queries/Operation</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(totalQueries / queryData.length)}</p>
        </div>
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
                  margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    type="number"
                    tick={{ fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <YAxis
                    type="category"
                    dataKey="operation"
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-slate-600 dark:text-slate-400"
                    width={140}
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
