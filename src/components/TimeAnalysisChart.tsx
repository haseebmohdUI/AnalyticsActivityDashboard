import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { useDataStore } from '@/store/dataStore';
import { filterRawData } from '@/utils/dataFilters';
import { getChartColor } from '@/utils/chartColors';

interface MonthlyData {
  month: string;
  loginCount: number;
  uniqueUsers: number;
}

export function TimeAnalysisChart() {
  const { startDate, endDate, selectedCompanies, searchUsername } = useFilterStore();
  const { loginData } = useDataStore();

  const monthlyData = useMemo(() => {
    const filteredData = filterRawData(loginData, startDate, endDate, selectedCompanies, searchUsername);
    const monthMap = new Map<string, { logins: number; users: Set<string> }>();

    filteredData.forEach((record) => {
      const date = new Date(record.datetime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { logins: 0, users: new Set() });
      }

      const monthData = monthMap.get(monthKey)!;
      monthData.logins++;
      monthData.users.add(record.username);
    });

    const sortedData: MonthlyData[] = Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        loginCount: data.logins,
        uniqueUsers: data.users.size,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return sortedData;
  }, [loginData, startDate, endDate, selectedCompanies, searchUsername]);

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const LoginCountTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const [year, month] = data.month.split('-');
      const fullDate = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });

      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {fullDate}
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              Login Count: <span className="font-bold">{data.loginCount}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const UniqueUsersTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const [year, month] = data.month.split('-');
      const fullDate = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });

      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {fullDate}
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Users className="w-3 h-3" />
              Unique Users: <span className="font-bold">{data.uniqueUsers}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const filteredData = useMemo(() =>
    filterRawData(loginData, startDate, endDate, selectedCompanies, searchUsername),
    [loginData, startDate, endDate, selectedCompanies, searchUsername]
  );

  const totalLogins = monthlyData.reduce((sum, d) => sum + d.loginCount, 0);
  const avgLoginsPerMonth = monthlyData.length > 0 ? Math.round(totalLogins / monthlyData.length) : 0;
  const allUniqueUsers = new Set(filteredData.map(r => r.username));

  const blueColor = getChartColor(0); // Blue from palette
  const purpleColor = getChartColor(4); // Purple from palette

  return (
    <div className="space-y-3">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Total Logins</p>
          </div>
          <p className="relative text-3xl font-bold text-blue-600 dark:text-blue-400">{totalLogins.toLocaleString()}</p>
        </div>
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-purple-50 via-purple-100/50 to-pink-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Avg Logins/Month</p>
          </div>
          <p className="relative text-3xl font-bold text-purple-600 dark:text-purple-400">{avgLoginsPerMonth}</p>
        </div>
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-50 via-green-100/50 to-emerald-50 dark:from-green-900/30 dark:via-green-800/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 hover:border-green-400 dark:hover:border-green-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/5 group-hover:to-green-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-xs font-semibold text-green-900 dark:text-green-300">Total Unique Users</p>
          </div>
          <p className="relative text-3xl font-bold text-green-600 dark:text-green-400">{allUniqueUsers.size}</p>
        </div>
      </div>

      {/* Monthly Analysis Charts */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ">

        <CardContent className="space-y-4 mt-3">
          {/* Monthly Login Count Chart */}
          <div >
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-1 flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Monthly Login Count
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Number of logins per month (0-250 range)
            </p>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barCategoryGap="10%"
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-slate-600 dark:text-slate-400"
                    tickFormatter={formatMonthLabel}
                  />
                  <YAxis
                    domain={[0, 240]}
                    tick={{ fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-400"
                    label={{
                      value: 'Number of Logins',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 0,
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip content={<LoginCountTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px', fontWeight: 'bold' }}
                    iconSize={0}
                  />
                  <Bar
                    dataKey="loginCount"
                    name="Login Count"
                    radius={[8, 8, 0, 0]}
                    fill={blueColor}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

          {/* Monthly Unique Users Chart */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-1 flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Monthly Unique Users
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Number of unique users per month
            </p>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barCategoryGap="10%"
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-slate-600 dark:text-slate-400"
                    tickFormatter={formatMonthLabel}
                  />
                  <YAxis
                    tick={{ fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-400"
                    label={{
                      value: 'Number of Unique Users',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 0,
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip content={<UniqueUsersTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px', fontWeight: 'bold' }}
                    iconSize={0}
                  />
                  <Bar
                    dataKey="uniqueUsers"
                    name="Unique Users"
                    radius={[8, 8, 0, 0]}
                    fill={purpleColor}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
