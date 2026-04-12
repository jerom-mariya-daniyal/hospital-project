import { format } from "date-fns";
import {
  HeartPulse,
  Calendar,
  User,
  ArrowLeft,
  ShieldCheck,
  Share2,
  Bookmark,
  Syringe,
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  Megaphone,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const TAG_META: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  Vaccination: { icon: Syringe,       color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200" },
  Emergency:   { icon: AlertTriangle, color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200" },
  Checkup:     { icon: Stethoscope,   color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200" },
  Inspection:  { icon: ClipboardList, color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200" },
  Campaign:    { icon: Megaphone,     color: "text-purple-700",  bg: "bg-purple-50",   border: "border-purple-200" },
  General:     { icon: LayoutGrid,    color: "text-slate-600",   bg: "bg-slate-50",    border: "border-slate-200" },
};

async function getActivity(id: string) {
  try {
    const res = await fetch(`http://localhost:5001/api/activities/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ActivityDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await getActivity(id);
  if (!activity) notFound();

  const tagKey = activity.tag || "General";
  const tagMeta = TAG_META[tagKey] || TAG_META["General"];
  const TagIcon = tagMeta.icon;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform shrink-0" />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="space-y-5 mb-10 sm:mb-14">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                Verified Report
              </div>
              {/* Tag Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border ${tagMeta.bg} ${tagMeta.color} ${tagMeta.border}`}
              >
                <TagIcon className="w-3.5 h-3.5 shrink-0" />
                {tagKey}
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.12]">
              {activity.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-5 border-t border-slate-100 text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-0.5">Published</p>
                  <p className="text-sm font-bold text-slate-900">{format(new Date(activity.createdAt), "MMMM d, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-0.5">Author</p>
                  <p className="text-sm font-bold text-slate-900">{activity.author?.name || "Veterinary Circle"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tagMeta.bg}`}>
                  <TagIcon className={`w-4 h-4 ${tagMeta.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-0.5">Category</p>
                  <p className={`text-sm font-bold ${tagMeta.color}`}>{tagKey}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {activity.images && activity.images.length > 0 && (
            <div className={`mb-12 sm:mb-16 grid gap-3 sm:gap-4 ${
              activity.images.length === 1
                ? "grid-cols-1"
                : activity.images.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 sm:grid-cols-3"
            }`}>
              {activity.images.map((img: string, i: number) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100 ${
                    i === 0 && activity.images.length >= 3 ? "col-span-2 sm:col-span-2 aspect-video" : "aspect-square"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Activity image ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Rich Text Content */}
          <div
            className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: activity.description }}
          />

          {/* CTA Banner */}
          <div className="mt-14 sm:mt-20 p-7 sm:p-10 bg-slate-900 rounded-3xl text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 pointer-events-none" />
            <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs mb-3">Organizational Record</p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-6 relative z-10 max-w-xl mx-auto">
              This is an official report of Thanjavur Circle operations.
            </h2>
            <Link
              href="/#portfolio"
              className="relative z-10 inline-block px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all"
            >
              Browse More Reports
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 sm:py-14 px-4 sm:px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <HeartPulse className="text-white w-4 h-4" />
            </div>
            <span className="text-base font-black tracking-tight text-slate-900 uppercase">Vet-Hub</span>
          </div>
          <p className="text-slate-400 font-medium text-sm text-center">
            &copy; {new Date().getFullYear()} Thanjavur Circle. Verified Data.
          </p>
          <Link href="/" className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">
            Back to Portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}
