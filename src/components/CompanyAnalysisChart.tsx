import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Building2, ChevronDown } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { useDataStore } from '@/store/dataStore';
import { filterRawData, aggregateCompanyData } from '@/utils/dataFilters';
import { generateChartColors } from '@/utils/chartColors'
import { getChartColor } from '@/utils/chartColors';
;

export function CompanyAnalysisChart() {
  const [viewMode, setViewMode] = useState<'logins' | 'users'>('logins');
  const [topLimit, setTopLimit] = useState(15);
  const { startDate, endDate, selectedCompanies, searchUsername } = useFilterStore();
  const { loginData } = useDataStore();

  const { topCompanies, allCompanies } = useMemo(() => {
    const filteredData = filterRawData(loginData, startDate, endDate, selectedCompanies, searchUsername);
    const companyData = aggregateCompanyData(filteredData);

    const sorted = viewMode === 'logins'
      ? [...companyData].sort((a, b) => b.totalLogins - a.totalLogins)
      : [...companyData].sort((a, b) => b.uniqueUsers - a.uniqueUsers);

    return {
      topCompanies: sorted.slice(0, topLimit),
      allCompanies: companyData
    };
  }, [loginData, startDate, endDate, selectedCompanies, searchUsername, viewMode, topLimit]);

  const chartData = topCompanies.map(company => ({
    name: company.company.length > 25 ? company.company.substring(0, 25) + '...' : company.company,
    fullName: company.company,
    totalLogins: company.totalLogins,
    uniqueUsers: company.uniqueUsers,
  }));

  // Generate colors from shared palette
  const barColors = generateChartColors(chartData.length);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-blue-800 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {payload[0].payload.fullName}
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="font-medium">Total Logins</span>
              </div>
              <span className="font-bold text-blue-700 dark:text-blue-300">{payload[0].payload.totalLogins.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">Unique Users</span>
              </div>
              <span className="font-bold text-purple-700 dark:text-purple-300">{payload[0].payload.uniqueUsers.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-blue-800 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {payload[0].payload.fullName}
            </p>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Total Logins:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.totalLogins.toLocaleString()}</span>
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

  // Prepare pie chart data
  const totalLogins = topCompanies.reduce((sum, company) => sum + company.totalLogins, 0);
  const pieData = chartData.map((item, index) => ({
    ...item,
    value: item.totalLogins,
    percentage: ((item.totalLogins / totalLogins) * 100).toFixed(1),
    fill: barColors[index]
  }));
  const blueColor = getChartColor(0); // Blue from palette
  return (
    <div className="space-y-3">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Total Companies</p>
          </div>
          <p className="relative text-3xl font-bold text-blue-600 dark:text-blue-400">{allCompanies.length}</p>
        </div>
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-purple-50 via-purple-100/50 to-pink-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Total Logins</p>
          </div>
          <p className="relative text-3xl font-bold text-purple-600 dark:text-purple-400">
            {allCompanies.reduce((sum, company) => sum + company.totalLogins, 0).toLocaleString()}
          </p>
        </div>
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-50 via-green-100/50 to-emerald-50 dark:from-green-900/30 dark:via-green-800/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 hover:border-green-400 dark:hover:border-green-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/5 group-hover:to-green-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-xs font-semibold text-green-900 dark:text-green-300">Total Users</p>
          </div>
          <p className="relative text-3xl font-bold text-green-600 dark:text-green-400">
            {allCompanies.reduce((sum, company) => sum + company.uniqueUsers, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart Card */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Top {topLimit} Companies
                </CardTitle>
              </div>
              <div className="relative">
                <select
                  value={topLimit}
                  onChange={(e) => setTopLimit(Number(e.target.value))}
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
            <CardDescription className="text-xs">
              {viewMode === 'logins' ? 'Companies ranked by total logins' : 'Companies ranked by unique users'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="h-[630px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
                  barCategoryGap="5%"
                >
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-700"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    angle={-60}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 500 }}
                    className="text-slate-700 dark:text-slate-300"
                    stroke="#94a3b8"
                  />
                  <YAxis
                    tick={{ fill: 'currentColor', fontWeight: 500 }}
                    className="text-slate-700 dark:text-slate-300"
                    stroke="#94a3b8"
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 106, 255, 0.05)' }} />
                  <Legend
                    wrapperStyle={{
                      paddingTop: '50px',
                      fontWeight: 600
                    }}
                    iconSize={0}
                  />
                  <Bar
                    dataKey={viewMode === 'logins' ? 'totalLogins' : 'uniqueUsers'}
                    name={viewMode === 'logins' ? 'Total Logins' : 'Unique Users'}
                    radius={[10, 10, 0, 0]}
                    maxBarSize={50}
                    animationDuration={800}
                    animationEasing="ease-out"
                    fill={blueColor}
                  >
                    {chartData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={barColors[index]}
                        opacity={0.9}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart Card */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Login Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Percentage distribution of logins across companies
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
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
                    wrapperStyle={{ fontSize: '10px', maxHeight: '500px', overflowY: 'auto' }}
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
