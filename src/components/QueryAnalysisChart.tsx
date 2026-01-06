import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, TrendingUp, Activity, Users, Calendar } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';

export function QueryAnalysisChart() {
  // Get query activity data from store
  const { queryActivityData } = useDataStore();
  const queryData = queryActivityData;

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
    name: item.operation, // Add name property for Legend
    value: item.count,
    percentage: ((item.count / top10Total) * 100).toFixed(1),
    fill: colors[index]
  }));

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: "'Raleway', sans-serif" }}>Query Analysis</h2>
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
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                    wrapperStyle={{
                      fontSize: '11px',
                      maxHeight: '550px',
                      overflowY: 'auto',
                      paddingLeft: '10px'
                    }}
                    formatter={(value: string) => {
                      // Truncate long operation names for legend
                      return value.length > 30 ? value.substring(0, 30) + '...' : value;
                    }}
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
