import { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Check,
  Loader2,
  Syringe,
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  Megaphone,
  LayoutGrid,
} from "lucide-react";

interface Activity {
  _id: string;
  title: string;
  description: string;
  images: string[];
  status: string;
  tag: string;
  author: { name: string };
  createdAt: string;
}

const TAGS = ["All", "Vaccination", "Emergency", "Checkup", "Inspection", "Campaign", "General"] as const;

const TAG_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  All: { icon: LayoutGrid, color: "text-slate-600", bg: "bg-slate-100" },
  Vaccination: { icon: Syringe, color: "text-blue-700", bg: "bg-blue-50" },
  Emergency: { icon: AlertTriangle, color: "text-red-700", bg: "bg-red-50" },
  Checkup: { icon: Stethoscope, color: "text-emerald-700", bg: "bg-emerald-50" },
  Inspection: { icon: ClipboardList, color: "text-amber-700", bg: "bg-amber-50" },
  Campaign: { icon: Megaphone, color: "text-purple-700", bg: "bg-purple-50" },
  General: { icon: LayoutGrid, color: "text-slate-600", bg: "bg-slate-100" },
};

export default function AdminDashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filtered, setFiltered] = useState<Activity[]>([]);
  const [activeTag, setActiveTag] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const fetchPendingActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/activities/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(data);
      setFiltered(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load pending activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const handleTagFilter = (tag: string) => {
    setActiveTag(tag);
    setFiltered(tag === "All" ? activities : activities.filter((a) => a.tag === tag));
  };

  const handlePublish = async (id: string) => {
    setPublishingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/api/activities/${id}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = activities.filter((a) => a._id !== id);
      setActivities(updated);
      setFiltered(activeTag === "All" ? updated : updated.filter((a) => a.tag === activeTag));
    } catch (err: any) {
      alert("Failed to publish activity: " + err.response?.data?.message);
    } finally {
      setPublishingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Review Queue</h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
            Approve staff submissions to publish them on the portal.
          </p>
        </div>
        <div className="flex items-center px-4 py-2.5 bg-amber-50 text-amber-800 rounded-xl text-sm font-bold self-start sm:self-auto shrink-0">
          <Clock className="w-4 h-4 mr-2 shrink-0" />
          {activities.length} Pending
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => {
          const meta = TAG_META[tag];
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => handleTagFilter(tag)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${isActive
                  ? "bg-slate-900 border-slate-900 text-white shadow-md"
                  : `border-slate-200 text-slate-500 hover:border-slate-700 hover:text-slate-900 ${meta.bg}`
                }`}
            >
              <meta.icon className="w-3.5 h-3.5" />
              {tag}
              {tag !== "All" && (
                <span className={`ml-0.5 font-black text-[10px] ${isActive ? "text-white/70" : "text-slate-400"}`}>
                  {activities.filter((a) => a.tag === tag).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 sm:p-16 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <CheckCircle className="w-14 h-14 text-emerald-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-700">
            {activeTag === "All" ? "All caught up!" : `No pending ${activeTag} reports`}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {activeTag === "All"
              ? "No pending activities to review right now."
              : `No ${activeTag} activities are awaiting review.`}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((activity) => {
            const tagMeta = TAG_META[activity.tag] || TAG_META["General"];
            const TagIcon = tagMeta.icon;
            return (
              <div
                key={activity._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="w-full h-48 md:w-48 md:h-auto md:min-h-[180px] shrink-0 overflow-hidden bg-slate-100">
                    {activity.images.length > 0 ? (
                      <img
                        src={activity.images[0]}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                        <span className="text-xs font-medium">No Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                          Pending
                        </span>
                        {/* Tag Badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${tagMeta.bg} ${tagMeta.color}`}
                        >
                          <TagIcon className="w-3 h-3" />
                          {activity.tag}
                        </span>
                        <span className="text-slate-400 text-xs font-medium">
                          {new Date(activity.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-tight">
                        {activity.title}
                      </h3>

                      <div
                        className="text-slate-500 text-sm leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: activity.description }}
                      />

                      <div className="mt-4 flex items-center text-slate-500 text-sm">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center mr-2.5 text-slate-700 font-bold text-sm shrink-0">
                          {activity.author.name.charAt(0)}
                        </div>
                        <span className="truncate">
                          By{" "}
                          <span className="text-slate-900 font-semibold">{activity.author.name}</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handlePublish(activity._id)}
                        disabled={publishingId === activity._id}
                        className="flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm focus:ring-4 focus:ring-emerald-100 disabled:opacity-70 active:scale-95"
                      >
                        {publishingId === activity._id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Publish Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
