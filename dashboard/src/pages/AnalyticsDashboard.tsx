import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  TrendingUp,
  Calendar as CalendarIcon
} from "lucide-react";

interface AnalyticsData {
  totalActivities: number;
  pendingActivities: number;
  publishedActivities: number;
  totalStaff: number;
  activityStats: Array<{ _id: { month: number; year: number }; count: number }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch {
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium text-sm">Loading analytics...</p>
    </div>
  );

  if (error || !data) return (
    <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-base font-medium text-center">
      {error || "An unexpected error occurred."}
    </div>
  );

  const stats = [
    { label: "Total Activities", value: data.totalActivities,   icon: FileText,    color: "bg-blue-50 text-blue-700"    },
    { label: "Pending Review",   value: data.pendingActivities,  icon: Clock,       color: "bg-amber-50 text-amber-700"  },
    { label: "Published",        value: data.publishedActivities,icon: CheckCircle, color: "bg-emerald-50 text-emerald-700" },
    { label: "Active Staff",     value: data.totalStaff,         icon: Users,       color: "bg-slate-100 text-slate-700" },
  ];

  const maxCount = data.activityStats.length > 0
    ? Math.max(...data.activityStats.map(s => s.count))
    : 1;

  const monthName = (m: number) => ["", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Circle Overview</h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">Performance metrics and activity trends.</p>
        </div>
        <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center text-slate-600 font-semibold text-sm self-start sm:self-auto">
          <CalendarIcon className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
          <span className="truncate">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid - 2 cols on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1 leading-tight">{stat.label}</p>
            <p className="text-3xl lg:text-4xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Lower Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-start justify-between mb-8 gap-4">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900">Activity Distribution</h3>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Reports submitted over time</p>
            </div>
            <BarChart3 className="w-6 h-6 text-slate-300 shrink-0" />
          </div>
          
          <div className="h-48 lg:h-56 flex items-end justify-between gap-3">
            {data.activityStats.length > 0 ? (
              data.activityStats.map((stat, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                  <div 
                    className="w-full bg-slate-900 rounded-md hover:bg-blue-600 transition-colors min-h-[6px]" 
                    style={{ height: `${Math.max((stat.count / maxCount) * 100, 5)}%` }}
                  />
                  <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{monthName(stat._id.month)}</p>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-slate-400 text-sm font-medium italic text-center px-4">No trend data available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Health Panel */}
        <div className="bg-slate-900 p-6 lg:p-8 rounded-2xl text-white shadow-xl flex flex-col justify-between gap-6">
          <div>
            <TrendingUp className="w-10 h-10 text-blue-400 mb-5" />
            <h3 className="text-xl lg:text-2xl font-bold mb-3">Organizational Health</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your circle has maintained <span className="text-white font-bold">85% efficiency</span> in report processing this week.
            </p>
          </div>
          <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
            <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Next Milestone</p>
            <p className="text-sm font-semibold text-white mb-3">Reach 50 Published Reports</p>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${Math.min((data.publishedActivities / 50) * 100, 100)}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{data.publishedActivities}/50 complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}
