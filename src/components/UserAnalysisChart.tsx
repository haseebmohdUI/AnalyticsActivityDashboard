import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, TrendingUp, ChevronDown } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { useDataStore } from '@/store/dataStore';
import { filterRawData } from '@/utils/dataFilters';
import { getChartColor } from '@/utils/chartColors';

interface UserData {
  username: string;
  fullName: string;
  loginCount: number;
}

export function UserAnalysisChart() {
  const { startDate, endDate, selectedCompanies, searchUsername } = useFilterStore();
  const { loginData } = useDataStore();
  const [topLimit, setTopLimit] = useState(15);

  const { topUsers, allUsers, totalLogins } = useMemo(() => {
    const filteredData = filterRawData(loginData, startDate, endDate, selectedCompanies, searchUsername);
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

    const sorted = usersArray.sort((a, b) => b.loginCount - a.loginCount);
    const totalLoginCount = usersArray.reduce((sum, user) => sum + user.loginCount, 0);

    return {
      topUsers: sorted.slice(0, topLimit),
      allUsers: usersArray,
      totalLogins: totalLoginCount
    };
  }, [loginData, startDate, endDate, selectedCompanies, searchUsername, topLimit]);

  const chartData = topUsers.map(user => ({
    username: user.username.length > 25 ? user.username.substring(0, 25) + '...' : user.username,
    fullUsername: user.username,
    fullName: user.fullName,
    loginCount: user.loginCount,
  }));

  const blueColor = getChartColor(0); // Blue from palette

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

  return (
    <div className="space-y-3">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Total Users</p>
          </div>
          <p className="relative text-3xl font-bold text-blue-600 dark:text-blue-400">{allUsers.length}</p>
        </div>
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-purple-50 via-purple-100/50 to-pink-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Total Logins</p>
          </div>
          <p className="relative text-3xl font-bold text-purple-600 dark:text-purple-400">{totalLogins.toLocaleString()}</p>
        </div>
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-50 via-green-100/50 to-emerald-50 dark:from-green-900/30 dark:via-green-800/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 hover:border-green-400 dark:hover:border-green-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/5 group-hover:to-green-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-xs font-semibold text-green-900 dark:text-green-300">Avg Logins/User</p>
          </div>
          <p className="relative text-3xl font-bold text-green-600 dark:text-green-400">{Math.round(totalLogins / allUsers.length)}</p>
        </div>
      </div>

      {/* Chart and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Bar Chart */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Top {topLimit} Users by Login Count
                </CardTitle>
                <CardDescription>
                  Users with the most logins
                </CardDescription>
              </div>
              <div className="relative">
                <select
                  value={topLimit}
                  onChange={(e) => setTopLimit(Number(e.target.value))}
                  className="px-4 py-2 text-sm rounded-lg appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 cursor-pointer pr-10"
                >
                  <option value={5}>Top 5</option>
                  <option value={10}>Top 10</option>
                  <option value={15}>Top 15</option>
                  <option value={20}>Top 20</option>
                  <option value={25}>Top 25</option>
                  <option value={30}>Top 30</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full" style={{ height: `${Math.max(400, chartData.length * 35)}px` }}>
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
                    wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }}
                    iconSize={0}
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
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Top {topLimit} Users Details
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
