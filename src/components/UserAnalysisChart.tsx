import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, TrendingUp } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { filterRawData } from '@/utils/dataFilters';

interface UserData {
  username: string;
  fullName: string;
  loginCount: number;
}

export function UserAnalysisChart() {
  const { startDate, endDate, selectedCompanies, searchUsername } = useFilterStore();

  const topUsers = useMemo(() => {
    const filteredData = filterRawData(startDate, endDate, selectedCompanies, searchUsername);
    const userMap = new Map<string, { firstName: string; lastName: string; count: number }>();

    filteredData.forEach((record) => {
      if (!userMap.has(record.username)) {
        userMap.set(record.username, {
          firstName: record.firstName,
          lastName: record.lastName,
          count: 0,
        });
      }
      const userData = userMap.get(record.username)!;
      userData.count++;
    });

    const usersArray: UserData[] = Array.from(userMap.entries()).map(([username, data]) => ({
      username,
      fullName: `${data.firstName} ${data.lastName}`,
      loginCount: data.count,
    }));

    return usersArray.sort((a, b) => b.loginCount - a.loginCount).slice(0, 10);
  }, [startDate, endDate, selectedCompanies, searchUsername]);

  const chartData = topUsers.map(user => ({
    username: user.username.length > 25 ? user.username.substring(0, 25) + '...' : user.username,
    fullUsername: user.username,
    fullName: user.fullName,
    loginCount: user.loginCount,
  }));

  const blueColor = '#0080ff';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {data.fullName}
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              {data.fullUsername}
            </p>
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

  const totalLogins = topUsers.reduce((sum, user) => sum + user.loginCount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Top 10 Users</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{topUsers.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200 dark:border-purple-800">
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">Total Logins (Top 10)</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalLogins.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800">
          <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">Avg Logins/User</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(totalLogins / topUsers.length)}</p>
        </div>
      </div>

      {/* Chart and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Bar Chart */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Top 10 Users by Login Count
            </CardTitle>
            <CardDescription>
              Users with the most logins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    type="number"
                    tick={{ fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <YAxis
                    type="category"
                    dataKey="username"
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-slate-600 dark:text-slate-400"
                    width={110}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="loginCount"
                    name="Login Count"
                    radius={[0, 8, 8, 0]}
                    fill={blueColor}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Top 10 Users Details
            </CardTitle>
            <CardDescription>
              Detailed user information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
                  <tr>
                    <th className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      Username
                    </th>
                    <th className="text-left p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      Full Name
                    </th>
                    <th className="text-right p-3 font-semibold text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      Login Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user, index) => (
                    <tr
                      key={user.username}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3 text-sm text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="truncate max-w-[200px]" title={user.username}>
                            {user.username}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-slate-700 dark:text-slate-300">
                        {user.fullName}
                      </td>
                      <td className="p-3 text-sm text-right font-semibold text-blue-600 dark:text-blue-400">
                        {user.loginCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
