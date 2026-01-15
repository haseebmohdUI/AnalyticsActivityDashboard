import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, Package, Activity, AlertTriangle, ChevronDown } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { useFilterStore } from '@/store/filterStore';
import { useMemo, useEffect, useRef, useState } from 'react';
import { generateChartColors } from '@/utils/chartColors';

export function ACSParticipantAnalysisChart() {
  const { acsParticipantData, isACSParticipantDataLoading, fetchACSParticipantDataFiltered } = useDataStore();
  const { year } = useFilterStore();
  const hasFetchedRef = useRef(false);
  const [topLimit, setTopLimit] = useState(10);
  const [pieLimit, setPieLimit] = useState(10);
  const [failRateLimit, setFailRateLimit] = useState(10);

  // Fetch data when year filter changes
  useEffect(() => {
    // Prevent double fetch on mount
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      // Only fetch if there's no data already loaded
      if (!acsParticipantData || acsParticipantData.length === 0) {
        console.log('Initial load - fetching all years...');
        fetchACSParticipantDataFiltered({});
      }
      return;
    }

    // User changed the year filter
    if (year) {
      console.log('Year filter changed to:', year);
      fetchACSParticipantDataFiltered({ year });
    } else {
      console.log('Fetching all years...');
      fetchACSParticipantDataFiltered({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  // Debug logging
  console.log('ACS Participant Chart - Data length:', acsParticipantData?.length || 0, 'Loading:', isACSParticipantDataLoading);

  // Calculate summary metrics - MUST be before any conditional returns
  const metrics = useMemo(() => {
    if (!acsParticipantData || acsParticipantData.length === 0) {
      return { uniqueManufacturers: 0, uniquePrograms: 0, totalTests: 0, avgFailRate: '0.0' };
    }

    const uniqueManufacturers = new Set(acsParticipantData.map(item => item.manufacturernamerev)).size;
    const uniquePrograms = new Set(acsParticipantData.map(item => item.programname)).size;
    const totalTests = acsParticipantData.reduce((sum, item) => sum + item.total_tests, 0);

    // Calculate weighted average fail rate (weighted by number of tests)
    const weightedFailRate = acsParticipantData.reduce((sum, item) => sum + (item.fail_rate * item.total_tests), 0);
    const avgFailRate = totalTests > 0 ? (weightedFailRate / totalTests).toFixed(1) : '0.0';

    return { uniqueManufacturers, uniquePrograms, totalTests, avgFailRate };
  }, [acsParticipantData]);

  // Top manufacturers by total tests
  const topManufacturers = useMemo(() => {
    if (!acsParticipantData || acsParticipantData.length === 0) {
      return [];
    }

    const manufacturerMap = new Map<string, number>();

    acsParticipantData.forEach(item => {
      const mfr = item.manufacturernamerev;
      const current = manufacturerMap.get(mfr) || 0;
      manufacturerMap.set(mfr, current + item.total_tests);
    });

    return Array.from(manufacturerMap.entries())
      .map(([manufacturer, total_tests]) => ({ manufacturer, total_tests }))
      .sort((a, b) => b.total_tests - a.total_tests)
      .slice(0, topLimit);
  }, [acsParticipantData, topLimit]);

  // Top manufacturers for pie chart
  const topManufacturersForPie = useMemo(() => {
    const topForPie = topManufacturers.slice(0, pieLimit);
    const totalTests = topForPie.reduce((sum, item) => sum + item.total_tests, 0);
    const colors = generateChartColors(pieLimit);

    return topForPie.map((item, index) => ({
      ...item,
      name: item.manufacturer,
      value: item.total_tests,
      percentage: ((item.total_tests / totalTests) * 100).toFixed(1),
      fill: colors[index]
    }));
  }, [topManufacturers, pieLimit]);

  // Fail rate by program
  const programFailRates = useMemo(() => {
    if (!acsParticipantData || acsParticipantData.length === 0) {
      return [];
    }

    const programMap = new Map<string, { totalTests: number; totalFailRate: number; count: number }>();

    acsParticipantData.forEach(item => {
      const program = item.programname;
      if (!programMap.has(program)) {
        programMap.set(program, { totalTests: 0, totalFailRate: 0, count: 0 });
      }

      const data = programMap.get(program)!;
      data.totalTests += item.total_tests;
      data.totalFailRate += item.fail_rate;
      data.count++;
    });

    return Array.from(programMap.entries())
      .map(([program, data]) => ({
        program,
        avgFailRate: (data.totalFailRate / data.count).toFixed(1),
        totalTests: data.totalTests
      }))
      .sort((a, b) => parseFloat(b.avgFailRate) - parseFloat(a.avgFailRate));
  }, [acsParticipantData]);

  // Top manufacturers by fail rate (with minimum 5 tests)
  const topByFailRate = useMemo(() => {
    if (!acsParticipantData || acsParticipantData.length === 0) {
      return [];
    }

    return acsParticipantData
      .filter(item => item.total_tests >= 5) // Only include manufacturers with at least 5 tests
      .sort((a, b) => b.fail_rate - a.fail_rate)
      .slice(0, failRateLimit)
      .map(item => ({
        manufacturer: item.manufacturernamerev,
        fail_rate: item.fail_rate,
        total_tests: item.total_tests
      }));
  }, [acsParticipantData, failRateLimit]);

  // Generate colors for all charts
  const mfrColors = generateChartColors(topLimit);
  const programColors = generateChartColors(programFailRates.length);
  const failRateColors = generateChartColors(failRateLimit);

  const ManufacturerTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.manufacturer}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Total Tests:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.total_tests.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const ProgramTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.program}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Avg Fail Rate:</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">{payload[0].payload.avgFailRate}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Total Tests:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.totalTests.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const FailRateTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.manufacturer}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Fail Rate:</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">{payload[0].payload.fail_rate}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Total Tests:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.total_tests.toLocaleString()}</span>
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
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
            {payload[0].payload.manufacturer}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">Tests:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.total_tests.toLocaleString()}</span>
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

  return (
    <div className="space-y-3">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Total Manufacturers</p>
          </div>
          <p className="relative text-3xl font-bold text-blue-600 dark:text-blue-400">{metrics.uniqueManufacturers}</p>
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
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-xs font-semibold text-green-900 dark:text-green-300">Total Tests</p>
          </div>
          <p className="relative text-3xl font-bold text-green-600 dark:text-green-400">{metrics.totalTests.toLocaleString()}</p>
        </div>

        <div className="group relative p-4 rounded-xl bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-700/50 hover:border-orange-400 dark:hover:border-orange-500 transition-all shadow hover:shadow-md hover:scale-[1.02] transform duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 to-orange-600/0 group-hover:from-orange-400/5 group-hover:to-orange-600/10 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="text-xs font-semibold text-orange-900 dark:text-orange-300">Avg Fail Rate</p>
          </div>
          <p className="relative text-3xl font-bold text-orange-600 dark:text-orange-400">{metrics.avgFailRate}%</p>
        </div>
      </div>

      {/* Charts Grid - Top Manufacturers and Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Top Manufacturers by Tests */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Top {topLimit} Manufacturers by Total Tests
                </CardTitle>
                <CardDescription className="text-xs">
                  Manufacturers with highest number of tests conducted
                </CardDescription>
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
          </CardHeader>
          <CardContent className="pb-3">
            <div className={`w-full ${topLimit <= 10 ? 'h-[420px]' : topLimit <= 15 ? 'h-[630px]' : topLimit <= 20 ? 'h-[840px]' : topLimit <= 25 ? 'h-[1050px]' : 'h-[1260px]'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topManufacturers}
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
                    dataKey="manufacturer"
                    tick={{ fill: 'currentColor', fontSize: topLimit > 20 ? 8 : 10 }}
                    className="text-slate-600 dark:text-slate-400"
                    width={topLimit > 20 ? 200 : 220}
                    interval={0}
                  />
                  <Tooltip content={<ManufacturerTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px', color: '#006daf', fontWeight: 'bold' }} iconSize={0} />
                  <Bar dataKey="total_tests" name="Total Tests" radius={[0, 8, 8, 0]}>
                    {topManufacturers.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={mfrColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Test Distribution Pie Chart */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Test Distribution (Top {pieLimit})
                </CardTitle>
                <CardDescription className="text-xs">
                  Distribution of tests across top {pieLimit} manufacturers
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
                    data={topManufacturersForPie}
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
                    {topManufacturersForPie.map((entry, index) => (
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
                      return value.length > 30 ? value.substring(0, 30) + '...' : value;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Program Fail Rates and Top Fail Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Average Fail Rate by Program */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Average Fail Rate by Program
            </CardTitle>
            <CardDescription className="text-xs">
              Programs ranked by average failure rate
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={programFailRates}
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
                    label={{ value: 'Fail Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<ProgramTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px', color: '#006daf', fontWeight: 'bold' }} iconSize={0} />
                  <Bar dataKey="avgFailRate" name="Avg Fail Rate (%)" radius={[8, 8, 0, 0]}>
                    {programFailRates.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={programColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Manufacturers by Fail Rate */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                  <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Top {failRateLimit} Manufacturers by Fail Rate
                </CardTitle>
                <CardDescription className="text-xs">
                  Manufacturers with highest failure rates (min. 5 tests)
                </CardDescription>
              </div>
              <div className="relative">
                <select
                  value={failRateLimit}
                  onChange={(e) => setFailRateLimit(Number(e.target.value))}
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
            <div className={`w-full ${failRateLimit <= 10 ? 'h-[400px]' : failRateLimit <= 15 ? 'h-[550px]' : failRateLimit <= 20 ? 'h-[700px]' : failRateLimit <= 25 ? 'h-[850px]' : 'h-[1000px]'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topByFailRate}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    type="number"
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-slate-600 dark:text-slate-400"
                    label={{ value: 'Fail Rate (%)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="manufacturer"
                    tick={{ fill: 'currentColor', fontSize: failRateLimit > 20 ? 8 : 10 }}
                    className="text-slate-600 dark:text-slate-400"
                    width={failRateLimit > 20 ? 180 : 200}
                    interval={0}
                  />
                  <Tooltip content={<FailRateTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px', color: '#006daf', fontWeight: 'bold' }} iconSize={0} />
                  <Bar dataKey="fail_rate" name="Fail Rate (%)" radius={[0, 8, 8, 0]}>
                    {topByFailRate.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={failRateColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
