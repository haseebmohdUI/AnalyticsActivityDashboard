import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users } from 'lucide-react';

export function CompanyAnalysisChart() {
  const [viewMode, setViewMode] = useState<'logins' | 'users'>('logins');
  const getTopCompaniesByLogins = useAnalyticsStore(state => state.getTopCompaniesByLogins);
  const getTopCompaniesByUsers = useAnalyticsStore(state => state.getTopCompaniesByUsers);

  const topCompanies = viewMode === 'logins'
    ? getTopCompaniesByLogins(15)
    : getTopCompaniesByUsers(15);

  const chartData = topCompanies.map(company => ({
    name: company.company.length > 25 ? company.company.substring(0, 25) + '...' : company.company,
    fullName: company.company,
    totalLogins: company.totalLogins,
    uniqueUsers: company.uniqueUsers,
  }));

  const blueColor = '#0080ff';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.fullName}
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              Total Logins: <span className="font-bold">{payload[0].payload.totalLogins}</span>
            </p>
            <p className="text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Users className="w-3 h-3" />
              Unique Users: <span className="font-bold">{payload[0].payload.uniqueUsers}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Company Analysis
            </CardTitle>
            <CardDescription>
              Top 15 companies by {viewMode === 'logins' ? 'total logins' : 'unique users'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('logins')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'logins'
                  ? 'text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              style={viewMode === 'logins' ? {
                background: 'linear-gradient(135deg, #475569 0%, #006aff 60%, #0080ff 100%)'
              } : undefined}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Total Logins
            </button>
            <button
              onClick={() => setViewMode('users')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'users'
                  ? 'text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              style={viewMode === 'users' ? {
                background: 'linear-gradient(135deg, #475569 0%, #006aff 60%, #0080ff 100%)'
              } : undefined}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Unique Users
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
           {/* Summary Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Total Companies</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{topCompanies.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">Total Logins</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {topCompanies.reduce((sum, company) => sum + company.totalLogins, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800">
            <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">Total Unique Users</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {topCompanies.reduce((sum, company) => sum + company.uniqueUsers, 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="h-[600px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fill: 'currentColor', fontSize: 11 }}
                className="text-slate-600 dark:text-slate-400"
              />
              <YAxis
                tick={{ fill: 'currentColor' }}
                className="text-slate-600 dark:text-slate-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px'
                }}
                iconType="circle"
              />
              <Bar
                dataKey={viewMode === 'logins' ? 'totalLogins' : 'uniqueUsers'}
                name={viewMode === 'logins' ? 'Total Logins' : 'Unique Users'}
                radius={[8, 8, 0, 0]}
                barSize={40}
                fill={blueColor}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

     
      </CardContent>
    </Card>
  );
}
