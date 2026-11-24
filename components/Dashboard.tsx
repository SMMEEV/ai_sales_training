import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { HistoricalSession, AppView } from "../types";
import {
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Activity,
  Zap,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowLeft,
  Home,
  DollarSign,
  Clock,
  Target,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface DashboardProps {
  history: HistoricalSession[];
  onStartTraining: () => void;
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  history,
  onStartTraining,
  onBack,
}) => {
  // State for filtering and sorting
  const [filterScenario, setFilterScenario] = useState<string>("All");
  const [sortConfig, setSortConfig] = useState<{
    field: "date" | "score";
    direction: "asc" | "desc";
  }>({
    field: "date",
    direction: "desc",
  });

  // Helper to get formatted date string YYYY-MM-DD for mock data relative to today
  const getPastDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  // Safe date formatter to avoid timezone issues with YYYY-MM-DD strings
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      // Changed to Date-Month-Year format (e.g. 25 October 2023)
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return dateStr;
  };

  const formatChartDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      // Changed to Day Month format (e.g. 25 Oct)
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    }
    return dateStr;
  };

  // Mock data generation if history is empty for visualization purposes
  const data =
    history.length > 0
      ? history
      : [
          { date: getPastDate(45), score: 65, scenario: "Cold Call" },
          { date: getPastDate(38), score: 68, scenario: "Discovery" },
          { date: getPastDate(30), score: 72, scenario: "Objection" },
          { date: getPastDate(21), score: 70, scenario: "Cold Call" },
          { date: getPastDate(14), score: 75, scenario: "Closing" },
          { date: getPastDate(7), score: 82, scenario: "Discovery" },
          { date: getPastDate(2), score: 85, scenario: "Negotiation" },
        ].sort((a, b) => a.date.localeCompare(b.date)); // Ensure chronological order for chart

  const averageScore = Math.round(
    data.reduce((acc, curr) => acc + curr.score, 0) / data.length,
  );
  const recentTrend = data[data.length - 1].score - data[0].score;

  // Get unique scenarios for filter
  const scenarios = [
    "All",
    ...Array.from(new Set(data.map((item) => item.scenario))),
  ];

  // Process data with filter and sort
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (filterScenario !== "All") {
      result = result.filter((item) => item.scenario === filterScenario);
    }

    // Sort
    result.sort((a, b) => {
      if (sortConfig.field === "date") {
        return sortConfig.direction === "asc"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      } else {
        return sortConfig.direction === "asc"
          ? a.score - b.score
          : b.score - a.score;
      }
    });

    return result;
  }, [data, filterScenario, sortConfig]);

  const handleSort = (field: "date" | "score") => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "desc"
          ? "asc"
          : "desc",
    }));
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-12 animate-fade-in pt-8 px-6 lg:px-12 pb-16">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200">
            <Zap className="w-3 h-3 fill-current" /> AI Powered Sales Training
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Sales{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Analytics
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
            Real-time roleplay simulations and AI-driven insights to help your
            team close more deals faster.
          </p>
        </div>
        <button
          onClick={onStartTraining}
          className="group relative px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 origin-left"></div>
          <span className="flex items-center gap-3 relative">
            Start New Session
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      {/* Primary KPI Stats - Glassmorphic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-10 rounded-3xl relative overflow-hidden group hover:bg-white/80 transition-colors border border-white/60 shadow-lg shadow-indigo-500/5">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="w-32 h-32 text-indigo-600" />
          </div>
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                Conversion Rate
              </div>
            </div>
            <div>
              <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
                28.4%
              </div>
              <div className="text-sm text-emerald-700 font-bold flex items-center gap-1 bg-emerald-100/50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                <ArrowUpRight className="w-4 h-4" /> +4.2% from last month
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-3xl relative overflow-hidden group hover:bg-white/80 transition-colors border border-white/60 shadow-lg shadow-emerald-500/5">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="w-32 h-32 text-emerald-600" />
          </div>
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                Avg Deal Size
              </div>
            </div>
            <div>
              <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
                $42.5k
              </div>
              <div className="text-sm text-emerald-700 font-bold flex items-center gap-1 bg-emerald-100/50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                <ArrowUpRight className="w-4 h-4" /> +15% from last month
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-3xl relative overflow-hidden group hover:bg-white/80 transition-colors border border-white/60 shadow-lg shadow-blue-500/5">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-32 h-32 text-blue-600" />
          </div>
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                Sales Cycle Length
              </div>
            </div>
            <div>
              <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
                42 Days
              </div>
              <div className="text-sm text-emerald-700 font-bold flex items-center gap-1 bg-emerald-100/50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                <TrendingUp className="w-4 h-4" /> 5 days faster
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="glass-card rounded-[2.5rem] p-10 border border-white/60 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Sparkles className="w-64 h-64 text-indigo-600" />
        </div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              AI Insights & Predictions
            </h3>
            <p className="text-slate-500 font-medium mt-1">
              Based on recent roleplaying performance and historical win rates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/60">
            <div className="flex items-center gap-3 mb-4 text-emerald-700">
              <TrendingUp className="w-6 h-6" />
              <h4 className="text-xl font-bold">Predicted Performance</h4>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6">
              AI analysis of your team's recent objection handling improvements
              indicates a{" "}
              <span className="font-bold text-emerald-600">
                14% likely increase
              </span>{" "}
              in Q3 conversion rates.
            </p>
            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/50">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                Key Driver
              </p>
              <p className="text-slate-800 font-medium">
                Enhanced Discovery Call scores correlate strongly with larger
                deal sizes this week.
              </p>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/60">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="text-xl font-bold">Skill Recommendations</h4>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6">
              Struggling with{" "}
              <span className="font-bold text-slate-900">
                Budget-Conscious Customers
              </span>
              . Win rates drop by 22% when price objections are raised early.
            </p>
            <button
              onClick={onStartTraining}
              className="w-full py-4 bg-white border-2 border-indigo-100 rounded-2xl text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm flex items-center justify-center gap-2 group"
            >
              Train Price Objection Scenario
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 rounded-3xl border border-white/60 shadow-lg shadow-indigo-500/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Training Performance Trajectory
            </h3>
            <select className="bg-slate-50 hover:bg-slate-100 border-none text-sm font-bold text-slate-600 rounded-xl px-4 py-2 outline-none cursor-pointer transition-colors">
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={15}
                  tickFormatter={formatChartDate}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickMargin={15}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <RechartsTooltip
                  labelFormatter={(label) => formatChartDate(label)}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    padding: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  activeDot={{
                    r: 8,
                    strokeWidth: 4,
                    stroke: "#fff",
                    fill: "#4338ca",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 rounded-3xl border border-white/60 shadow-lg shadow-indigo-500/5">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">
            Scenario Mastery
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Cold Call", score: 68, fill: "#60a5fa" },
                  { name: "Discovery", score: 82, fill: "#818cf8" },
                  { name: "Negotiation", score: 75, fill: "#c084fc" },
                ]}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  fontSize={13}
                  fontWeight={600}
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  cursor={{ fill: "rgba(241, 245, 249, 0.5)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="score"
                  radius={[0, 8, 8, 0]}
                  barSize={32}
                  background={{ fill: "#f1f5f9", radius: [0, 8, 8, 0] }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table - Card Style */}
      <div className="glass-card rounded-3xl overflow-hidden min-h-[400px] border border-white/60 shadow-lg shadow-indigo-500/5">
        <div className="px-10 py-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-slate-900">
              Recent Training Sessions
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
              Live
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative group z-10">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterScenario}
                onChange={(e) => setFilterScenario(e.target.value)}
                className="pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
              >
                {scenarios.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-slate-500 font-bold border-b border-slate-100/50 bg-slate-50/50">
              <tr>
                <th
                  className="px-10 py-6 cursor-pointer hover:bg-slate-50 transition-colors group select-none"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Date
                    {sortConfig.field === "date" &&
                      (sortConfig.direction === "desc" ? (
                        <ChevronDown className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-indigo-500" />
                      ))}
                    {sortConfig.field !== "date" && (
                      <ArrowUpDown className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </th>
                <th className="px-10 py-6">Scenario</th>
                <th
                  className="px-10 py-6 cursor-pointer hover:bg-slate-50 transition-colors group select-none"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center gap-2">
                    Performance
                    {sortConfig.field === "score" &&
                      (sortConfig.direction === "desc" ? (
                        <ChevronDown className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-indigo-500" />
                      ))}
                    {sortConfig.field !== "score" && (
                      <ArrowUpDown className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </th>
                <th className="px-10 py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {processedData.length > 0 ? (
                processedData.map((session, i) => (
                  <tr
                    key={i}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-10 py-6 font-semibold text-slate-800">
                      {formatDateDisplay(session.date)}
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-4 py-1.5 rounded-lg bg-white text-slate-600 font-semibold border border-slate-200 shadow-sm group-hover:border-indigo-200 transition-colors">
                        {session.scenario}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              session.score >= 80
                                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                : session.score >= 60
                                  ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                  : "bg-gradient-to-r from-rose-400 to-rose-500"
                            }`}
                            style={{ width: `${session.score}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-700 w-8">
                          {session.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="text-slate-400 font-medium">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-10 py-12 text-center text-slate-400"
                  >
                    No sessions found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
