"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  HeartPulse,
  Calendar,
  User,
  ArrowRight,
  Globe,
  Syringe,
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  Megaphone,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";

const TAGS = ["All", "Vaccination", "Emergency", "Checkup", "Inspection", "Campaign", "General"] as const;
type Tag = (typeof TAGS)[number];

const TAG_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  All:         { icon: LayoutGrid,    color: "text-slate-700",   bg: "bg-slate-100" },
  Vaccination: { icon: Syringe,       color: "text-blue-700",    bg: "bg-blue-50" },
  Emergency:   { icon: AlertTriangle, color: "text-red-700",     bg: "bg-red-50" },
  Checkup:     { icon: Stethoscope,   color: "text-emerald-700", bg: "bg-emerald-50" },
  Inspection:  { icon: ClipboardList, color: "text-amber-700",   bg: "bg-amber-50" },
  Campaign:    { icon: Megaphone,     color: "text-purple-700",  bg: "bg-purple-50" },
  General:     { icon: HeartPulse,    color: "text-slate-600",   bg: "bg-slate-50" },
};

interface Activity {
  _id: string;
  title: string;
  description: string;
  images: string[];
  tag: string;
  author: { name: string };
  createdAt: string;
}

export default function PortfolioGrid() {
  const [activeTag, setActiveTag] = useState<Tag>("All");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async (tag: Tag) => {
    setLoading(true);
    try {
      const url =
        tag === "All"
          ? "http://localhost:5001/api/activities"
          : `http://localhost:5001/api/activities?tag=${tag}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setActivities(data);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities(activeTag);
  }, [activeTag, fetchActivities]);

  const handleTagChange = (tag: Tag) => {
    setActiveTag(tag);
  };

  return (
    <section id="portfolio" className="bg-slate-50/50 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">
              Published Work
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Activity Portfolio
            </h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Verified reports from field operations.
            </p>
          </div>

          {/* Tag Filter Buttons */}
          <div className="flex flex-wrap gap-2 pb-1 shrink-0">
            {TAGS.map((tag) => {
              const meta = TAG_META[tag];
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  id={`portfolio-filter-${tag.toLowerCase()}`}
                  onClick={() => handleTagChange(tag)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white shadow-md"
                      : `border-slate-200 text-slate-500 hover:border-slate-800 hover:text-slate-800 ${meta.bg}`
                  }`}
                >
                  <meta.icon className="w-3.5 h-3.5" />
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active tag indicator */}
        {activeTag !== "All" && (
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold">
            <span>Showing:</span>
            <span className="text-blue-300">{activeTag}</span>
            <button
              onClick={() => handleTagChange("All")}
              className="ml-1 text-white/50 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
              >
                <div className="aspect-[4/3] bg-slate-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                  <div className="h-5 bg-slate-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 sm:p-24 text-center border border-slate-100">
            <Globe className="w-14 h-14 text-slate-200 mx-auto mb-5" />
            <p className="text-xl text-slate-400 font-black italic">
              {activeTag === "All"
                ? "The Circle is preparing new reports."
                : `No ${activeTag} reports found.`}
            </p>
            {activeTag !== "All" && (
              <button
                onClick={() => handleTagChange("All")}
                className="mt-4 text-blue-600 font-bold text-sm hover:underline"
              >
                View all reports
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {activities.map((activity) => {
              const tagMeta = TAG_META[activity.tag] || TAG_META["General"];
              const TagIcon = tagMeta.icon;
              return (
                <Link
                  key={activity._id}
                  href={`/activities/${activity._id}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                    {activity.images && activity.images.length > 0 ? (
                      <img
                        src={activity.images[0]}
                        alt={activity.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HeartPulse className="w-12 h-12 text-slate-200" />
                      </div>
                    )}
                    {/* Tag Badge */}
                    <span
                      className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm bg-white/90 shadow-sm ${tagMeta.color}`}
                    >
                      <TagIcon className="w-3 h-3" />
                      {activity.tag}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(activity.createdAt), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {(activity.author?.name || "Staff").split(" ")[0]}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {activity.title}
                    </h3>
                    <div
                      className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1"
                      dangerouslySetInnerHTML={{ __html: activity.description }}
                    />
                    <span className="text-xs font-bold text-blue-600 flex items-center group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
