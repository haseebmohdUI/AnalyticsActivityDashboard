import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, TrendingUp, Activity, Users, Calendar, ChevronDown } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { getChartColor, generateChartColors } from '@/utils/chartColors';
import { useState, useMemo } from 'react';

export function QueryAnalysisChart() {
  // Get query activity data from store
  const { queryActivityData } = useDataStore();
  const queryData = queryActivityData;
  const [operationsLimit, setOperationsLimit] = useState(15);
  const [pieLimit, setPieLimit] = useState(10);

  const topOperations = useMemo(() => queryData.slice(0, operationsLimit), [queryData, operationsLimit]);
  const topOperationsForPie = useMemo(() => queryData.slice(0, pieLimit), [queryData, pieLimit]);

  // Generate colors from shared palette
  const colors = generateChartColors(operationsLimit);
  const pieColors = generateChartColors(pieLimit);

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
  const pieTotal = useMemo(() => topOperationsForPie.reduce((sum, q) => sum + q.count, 0), [topOperationsForPie]);

  // Calculate metrics from data
  const uniqueOperations = queryData.length;
  const uniqueUsers = 298; // Total unique users across all operations

  // Calculate days span from earliest to latest query
  const allDates = queryData.flatMap(q => [new Date(q.firstQuery), new Date(q.lastQuery)]);
  const earliestDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const latestDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const daysSpan = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24));

  // Prepare pie chart data
  const pieData = useMemo(() => topOperationsForPie.map((item, index) => ({
    ...item,
    name: item.operation, // Add name property for Legend
    value: item.count,
    percentage: ((item.count / pieTotal) * 100).toFixed(1),
    fill: pieColors[index]
  })), [topOperationsForPie, pieTotal, pieColors]);
  const blueColor = getChartColor(0); // Blue from palette
  return (
    <div className="space-y-3">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Total Queries</p>
          </div>
          <p className="relative text-3xl font-bold text-blue-600 dark:text-blue-400">{totalQueries.toLocaleString()}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-purple-50 via-purple-100/50 to-pink-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Unique Users</p>
          </div>
          <p className="relative text-3xl font-bold text-purple-600 dark:text-purple-400">{uniqueUsers}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-50 via-green-100/50 to-emerald-50 dark:from-green-900/30 dark:via-green-800/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 hover:border-green-400 dark:hover:border-green-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/5 group-hover:to-green-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-xs font-semibold text-green-900 dark:text-green-300">Unique Operations</p>
          </div>
          <p className="relative text-3xl font-bold text-green-600 dark:text-green-400">{uniqueOperations}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-700/50 hover:border-orange-400 dark:hover:border-orange-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 to-orange-600/0 group-hover:from-orange-400/5 group-hover:to-orange-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="text-xs font-semibold text-orange-900 dark:text-orange-300">Days Span</p>
          </div>
          <p className="relative text-3xl font-bold text-orange-600 dark:text-orange-400">{daysSpan.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Horizontal Bar Chart */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Top {operationsLimit} Operations by Query Count
                </CardTitle>
                <CardDescription className="text-xs">
                  Most frequently executed operations
                </CardDescription>
              </div>
              <div className="relative">
                <select
                  value={operationsLimit}
                  onChange={(e) => setOperationsLimit(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs rounded-lg appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 cursor-pointer pr-8"
                >
                  <option value={5}>Top 5</option>
                  <option value={10}>Top 10</option>
                  <option value={15}>Top 15</option>
                  <option value={20}>Top 20</option>
                  <option value={25}>Top 25</option>
                  <option value={30}>Top 30</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className={`w-full ${operationsLimit <= 10 ? 'h-[420px]' : operationsLimit <= 15 ? 'h-[630px]' : operationsLimit <= 20 ? 'h-[840px]' : operationsLimit <= 25 ? 'h-[1050px]' : 'h-[1260px]'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topOperations}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    type="number"
                    domain={[0, 5000]}
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <YAxis
                    type="category"
                    dataKey="operation"
                    tick={{ fill: 'currentColor', fontSize: operationsLimit > 20 ? 11 : 12 }}
                    className="text-slate-600 dark:text-slate-400"
                    width={operationsLimit > 20 ? 200 : 220}
                    interval={0}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px', fontWeight: 'bold' }}
                    iconSize={0}
                  />
                  <Bar
                    dataKey="count"
                    name="Query Count"
                    radius={[0, 8, 8, 0]}
                  >
                    {topOperations.map((_entry, index) => (
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
          <CardHeader className="pb-2 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Query Distribution (Top {pieLimit})
                </CardTitle>
                <CardDescription className="text-xs">
                  Distribution of queries across top {pieLimit} operations
                </CardDescription>
              </div>
              <div className="relative">
                <select
                  value={pieLimit}
                  onChange={(e) => setPieLimit(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs rounded-lg appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 cursor-pointer pr-8"
                >
                  <option value={5}>Top 5</option>
                  <option value={10}>Top 10</option>
                  <option value={15}>Top 15</option>
                  <option value={20}>Top 20</option>
                  <option value={25}>Top 25</option>
                  <option value={30}>Top 30</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="h-[480px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.percentage}%`}
                    outerRadius={150}
                    innerRadius={70}
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
                      fontSize: '10px',
                      maxHeight: '440px',
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
