import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import rawData from '@/store/rawData.json';

interface LoginRecord {
  datetime: string;
  username: string;
  firstName: string;
  lastName: string;
  company: string;
}

interface MonthlyData {
  month: string;
  loginCount: number;
  uniqueUsers: number;
}

export function TimeAnalysisChart() {
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { logins: number; users: Set<string> }>();

    (rawData as LoginRecord[]).forEach((record) => {
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
  }, []);

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

  const totalLogins = monthlyData.reduce((sum, d) => sum + d.loginCount, 0);
  const avgLoginsPerMonth = Math.round(totalLogins / monthlyData.length);
  const allUniqueUsers = new Set((rawData as LoginRecord[]).map(r => r.username));

  const blueColor = '#0080ff';
  const purpleColor = '#a855f7';

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Total Logins</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalLogins.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200 dark:border-purple-800">
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">Avg Logins/Month</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{avgLoginsPerMonth}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800">
          <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">Total Unique Users</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{allUniqueUsers.size}</p>
        </div>
      </div>

      {/* Monthly Login Count Chart */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
            <Calendar className="w-5 h-5" />
            Monthly Login Count
          </CardTitle>
          <CardDescription>
            Number of logins per month (0-250 range)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barCategoryGap="10%"
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  className="text-slate-600 dark:text-slate-400"
                  tickFormatter={formatMonthLabel}
                />
                <YAxis
                  domain={[0, 250]}
                  tick={{ fill: 'currentColor' }}
                  className="text-slate-600 dark:text-slate-400"
                  label={{ value: 'Number of Logins', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<LoginCountTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
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
        </CardContent>
      </Card>

      {/* Monthly Unique Users Chart */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
            <Users className="w-5 h-5" />
            Monthly Unique Users
          </CardTitle>
          <CardDescription>
            Number of unique users per month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barCategoryGap="10%"
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  className="text-slate-600 dark:text-slate-400"
                  tickFormatter={formatMonthLabel}
                />
                <YAxis
                  tick={{ fill: 'currentColor' }}
                  className="text-slate-600 dark:text-slate-400"
                  label={{ value: 'Number of Unique Users', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<UniqueUsersTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
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
        </CardContent>
      </Card>
    </div>
  );
}
