import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { useFilterStore } from '@/store/filterStore';
import { useMemo } from 'react';

export function OEMPMBAnalysisChart() {
  const { licenseeData } = useDataStore();
  const { program, status } = useFilterStore();

  // Apply filters
  const filteredLicenseeData = useMemo(() => {
    return licenseeData.filter((item) => {
      const matchesProgram = !program || item.Program === program;
      const matchesStatus = !status || item.Status === status;
      return matchesProgram && matchesStatus;
    });
  }, [licenseeData, program, status]);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    const uniqueOEMs = new Set(filteredLicenseeData.map(item => item["OEM Name"])).size;
    const uniquePrograms = new Set(filteredLicenseeData.map(item => item.Program)).size;
    const totalActive = filteredLicenseeData.reduce((sum, item) => sum + item.Active, 0);
    const totalProductionStopped = filteredLicenseeData.reduce((sum, item) => sum + item["Production Stopped"], 0);

    return { uniqueOEMs, uniquePrograms, totalActive, totalProductionStopped };
  }, [filteredLicenseeData]);

  // Group by Program
  const programData = useMemo(() => {
    const programMap = new Map<string, {
      active: number;
      productionStopped: number;
      discontinued: number;
      obsolete: number;
      total: number;
    }>();

    filteredLicenseeData.forEach(item => {
      const program = item.Program;
      if (!programMap.has(program)) {
        programMap.set(program, {
          active: 0,
          productionStopped: 0,
          discontinued: 0,
          obsolete: 0,
          total: 0
        });
      }

      const data = programMap.get(program)!;
      data.active += item.Active;
      data.productionStopped += item["Production Stopped"];
      data.discontinued += item.Discontinued;
      data.obsolete += item["Obsolete (min and other)"];
      data.total += item["Total Active & PS"];
    });

    return Array.from(programMap.entries())
      .map(([program, data]) => ({
        program,
        ...data
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredLicenseeData]);

  // Top 10 OEMs by total active units
  const top10OEMs = useMemo(() => {
    const oemMap = new Map<string, number>();

    filteredLicenseeData.forEach(item => {
      const oem = item["OEM Name"];
      const current = oemMap.get(oem) || 0;
      oemMap.set(oem, current + item["Total Active & PS"]);
    });

    return Array.from(oemMap.entries())
      .map(([oem, total]) => ({ oem, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [filteredLicenseeData]);

  // Status breakdown across all data
  const statusData = useMemo(() => {
    const total = {
      active: filteredLicenseeData.reduce((sum, item) => sum + item.Active, 0),
      productionStopped: filteredLicenseeData.reduce((sum, item) => sum + item["Production Stopped"], 0),
      discontinued: filteredLicenseeData.reduce((sum, item) => sum + item.Discontinued, 0),
      obsolete: filteredLicenseeData.reduce((sum, item) => sum + item["Obsolete (min and other)"], 0)
    };

    return [
      { status: 'Active', count: total.active, color: '#22c55e' },
      { status: 'Production Stopped', count: total.productionStopped, color: '#f59e0b' },
      { status: 'Discontinued', count: total.discontinued, color: '#ef4444' },
      { status: 'Obsolete', count: total.obsolete, color: '#6b7280' }
    ];
  }, [filteredLicenseeData]);

  // Generate colors for program chart
  const generateColors = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const hue = 210 + (i * 25) % 120;
      return `hsl(${hue}, 75%, 55%)`;
    });
  };

  const programColors = generateColors(programData.length);
  const oemColors = generateColors(10);

  const ProgramTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.program}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Total:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-green-600 dark:text-green-400">Active:</span>
              <span className="font-bold text-green-600 dark:text-green-400">{payload[0].payload.active.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-orange-600 dark:text-orange-400">Prod. Stopped:</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">{payload[0].payload.productionStopped.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const OEMTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.oem}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Total Units:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const StatusTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const totalCount = statusData.reduce((sum, item) => sum + item.count, 0);
      const percentage = ((payload[0].payload.count / totalCount) * 100).toFixed(1);

      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.status}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Count:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.count.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Percentage:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Total OEMs</p>
          </div>
          <p className="relative text-3xl font-bold text-blue-600 dark:text-blue-400">{metrics.uniqueOEMs}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-purple-50 via-purple-100/50 to-pink-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Total Programs</p>
          </div>
          <p className="relative text-3xl font-bold text-purple-600 dark:text-purple-400">{metrics.uniquePrograms}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-50 via-green-100/50 to-emerald-50 dark:from-green-900/30 dark:via-green-800/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 hover:border-green-400 dark:hover:border-green-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/5 group-hover:to-green-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-xs font-semibold text-green-900 dark:text-green-300">Total Active Units</p>
          </div>
          <p className="relative text-3xl font-bold text-green-600 dark:text-green-400">{metrics.totalActive.toLocaleString()}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-700/50 hover:border-orange-400 dark:hover:border-orange-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 to-orange-600/0 group-hover:from-orange-400/5 group-hover:to-orange-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="text-xs font-semibold text-orange-900 dark:text-orange-300">Production Stopped</p>
          </div>
          <p className="relative text-3xl font-bold text-orange-600 dark:text-orange-400">{metrics.totalProductionStopped.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Program Distribution Bar Chart */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Distribution by Program
            </CardTitle>
            <CardDescription className="text-xs">
              Total active and production stopped units per program
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={programData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    dataKey="program"
                    angle={-45}
                    textAnchor="end"
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    className="text-slate-600 dark:text-slate-400"
                    height={80}
                  />
                  <YAxis
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <Tooltip content={<ProgramTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                  <Bar dataKey="total" name="Total Units" radius={[8, 8, 0, 0]}>
                    {programData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={programColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Status Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Breakdown of units by status
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => {
                      const totalCount = statusData.reduce((sum, item) => sum + item.count, 0);
                      const percentage = ((entry.count / totalCount) * 100).toFixed(1);
                      return `${percentage}%`;
                    }}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="count"
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<StatusTooltip />} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingLeft: '10px'
                    }}
                    formatter={(value: string, entry: any) => {
                      return `${value}: ${entry.payload.count.toLocaleString()}`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 OEMs Bar Chart */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Top 10 OEMs by Total Units
          </CardTitle>
          <CardDescription className="text-xs">
            OEMs with highest total active and production stopped units
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top10OEMs}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis
                  type="number"
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  className="text-slate-600 dark:text-slate-400"
                />
                <YAxis
                  type="category"
                  dataKey="oem"
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  className="text-slate-600 dark:text-slate-400"
                  width={200}
                />
                <Tooltip content={<OEMTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                <Bar dataKey="total" name="Total Units" radius={[0, 8, 8, 0]}>
                  {top10OEMs.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={oemColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
