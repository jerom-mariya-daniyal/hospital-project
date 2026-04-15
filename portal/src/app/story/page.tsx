import Link from "next/link";
import {
  HeartPulse,
  ArrowLeft,
  ArrowRight,
  Award,
  Syringe,
  Users,
  MapPin,
  ShieldCheck,
  Star,
  Target,
  Globe,
  BookOpen,
  TrendingUp,
  Zap,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Our Story — Thanjavur Circle Vet-Hub",
  description:
    "The history, mission, and milestones of the Thanjavur Veterinary Circle — dedicated to animal welfare across the district since 2001.",
};

const MILESTONES = [
  {
    year: "2001",
    title: "The Circle is Founded",
    body: "Thanjavur Veterinary Circle was formally established under the Tamil Nadu Animal Husbandry Department to unify field veterinary operations across all sub-divisions of the district.",
    icon: Star,
    accent: "blue",
  },
  {
    year: "2006",
    title: "First Mass Vaccination Drive",
    body: "The circle conducted its first coordinated district-wide livestock vaccination campaign, inoculating over 40,000 cattle and small ruminants against Foot-and-Mouth Disease in a single season.",
    icon: Syringe,
    accent: "emerald",
  },
  {
    year: "2011",
    title: "Mobile Veterinary Unit Launched",
    body: "A fleet of mobile veterinary clinics was deployed to serve remote agrarian communities, bringing clinical care to over 120 villages that previously had no access to veterinary support.",
    icon: MapPin,
    accent: "amber",
  },
  {
    year: "2015",
    title: "Award for Excellence in Animal Welfare",
    body: "Recognised by the Government of Tamil Nadu with the State Award for Outstanding Contribution to Animal Husbandry — the first district veterinary circle in the region to receive this distinction.",
    icon: Award,
    accent: "purple",
  },
  {
    year: "2019",
    title: "Digital Records Initiative",
    body: "Piloted the first digital livestock health record system in the district, enabling real-time tracking of treatment histories and vaccination schedules across 200+ registered farms.",
    icon: BookOpen,
    accent: "rose",
  },
  {
    year: "2023",
    title: "Vet-Hub Platform Goes Live",
    body: "Launched the Vet-Hub internal platform to digitize field activity reporting, administrative review, and public communication — completing the circle's transition to a fully modern operations model.",
    icon: Globe,
    accent: "blue",
  },
];

const ACCENT_CLASSES: Record<string, { ring: string; bg: string; text: string; dot: string }> = {
  blue:    { ring: "ring-blue-200",    bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  emerald: { ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  amber:   { ring: "ring-amber-200",   bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  purple:  { ring: "ring-purple-200",  bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-500" },
  rose:    { ring: "ring-rose-200",    bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500" },
};

const STATS = [
  { value: "23+",    label: "Years of Service",          icon: Clock },
  { value: "2.8L+",  label: "Animals Treated",           icon: HeartPulse },
  { value: "180+",   label: "Villages Served",           icon: MapPin },
  { value: "34",     label: "Active Field Officers",     icon: Users },
  { value: "96%",    label: "Vaccination Coverage",      icon: Syringe },
  { value: "6",      label: "State Awards Received",     icon: Award },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Scientific Integrity",
    body: "Every intervention we make is grounded in evidence-based veterinary medicine. We do not compromise on protocol.",
  },
  {
    icon: Users,
    title: "Community First",
    body: "The farmer comes before the form. Our field officers are trained to serve the community, not just the administration.",
  },
  {
    icon: Target,
    title: "Accountability",
    body: "Every dose, every field visit, and every outcome is documented. Transparency is the foundation of trust.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    body: "We review our performance annually and adopt best practices from across India's veterinary network.",
  },
  {
    icon: Zap,
    title: "Rapid Response",
    body: "Disease outbreaks wait for no one. Our emergency response protocols ensure mobilisation within 4 hours.",
  },
  {
    icon: Globe,
    title: "Sustainable Practice",
    body: "We balance productive animal agriculture with ecological responsibility and long-term rural livelihoods.",
  },
];

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
              <HeartPulse className="text-white w-4 h-4" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900 uppercase">Vet-Hub</span>
          </Link>
          <div className="hidden sm:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <Link href="/#portfolio" className="hover:text-slate-900 transition-colors">Portfolio</Link>
            <Link href="/story" className="text-slate-900 border-b-2 border-blue-600 pb-0.5">Our Story</Link>
          </div>
          <Link href="/" className="group flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft className="mr-1.5 w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Portal</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </nav>

      <main>
        {/* ── HERO ── */}
        <section className="pt-32 sm:pt-44 pb-20 sm:pb-28 px-4 sm:px-6 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-24 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-2xl" />
          </div>
          <div className="max-w-5xl mx-auto relative z-10">
            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-5">
              Est. 2001 · Thanjavur District
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] mb-8 max-w-3xl">
              Two decades of{" "}
              <span className="relative inline-block">
                <span className="relative z-10">veterinary</span>
                <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-3 sm:h-4 bg-blue-100 -z-0 rounded" />
              </span>{" "}
              service.
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              The Thanjavur Veterinary Circle has protected the health of livestock
              and supported the livelihoods of farmers across the district since 2001.
              This is our story.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
              <Link
                href="#timeline"
                className="inline-flex items-center px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
              >
                Read Our History <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/#portfolio"
                className="inline-flex items-center px-7 py-3.5 border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:border-slate-800 transition-all"
              >
                View Field Reports
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS BELT ── */}
        <section className="bg-slate-900 py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white/10 rounded-xl mb-3">
                    <Icon className="w-5 h-5 text-blue-300" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{value}</p>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section id="timeline" className="py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-14 sm:mb-20">
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.35em] mb-3">History</p>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Key Milestones</h2>
              <p className="text-slate-400 font-medium mt-3 max-w-lg">
                Over two decades of field operations, policy implementation, and community service.
              </p>
            </div>

            {/* Timeline items */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 sm:left-10 top-0 bottom-0 w-px bg-slate-100" />

              <div className="space-y-10 sm:space-y-14">
                {MILESTONES.map((m, i) => {
                  const MIcon = m.icon;
                  const ac = ACCENT_CLASSES[m.accent] || ACCENT_CLASSES.blue;
                  return (
                    <div key={i} className="flex gap-6 sm:gap-10 group">
                      {/* Icon node */}
                      <div className="relative shrink-0">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${ac.bg} ring-4 ${ac.ring} flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform shadow-sm`}>
                          <MIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${ac.text}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2 pt-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`text-xs font-black ${ac.text} uppercase tracking-widest`}>{m.year}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${ac.dot}`} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug mb-2">
                          {m.title}
                        </h3>
                        <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
                          {m.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="bg-slate-50 py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-14 sm:mb-20 max-w-2xl">
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.35em] mb-3">What Drives Us</p>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">Our Core Values</h2>
              <p className="text-slate-400 font-medium text-base">
                The principles that guide every field visit, every policy decision, and every interaction with the farming community.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {VALUES.map(({ icon: VIcon, title, body }, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                    <VIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE / VISION ── */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-8">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Our Vision</span>
            </div>
            <blockquote className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] mb-8">
              &quot;A Thanjavur where every animal is{" "}
              <span className="text-blue-600">healthy</span>,
              every farmer is{" "}
              <span className="text-emerald-600">supported</span>,
              and every field officer is{" "}
              <span className="text-amber-600">proud</span>.&quot;
            </blockquote>
            <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">
              — Thanjavur Veterinary Circle, Mission Statement
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-slate-900 py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-10 pointer-events-none" />
            <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[11px] mb-4">Explore Our Work</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-6 relative z-10">
              See what the circle has been doing in the field
            </h2>
            <p className="text-slate-400 font-medium mb-10 max-w-xl mx-auto text-sm sm:text-base">
              Our activity portfolio contains verified, published reports from every major operation — vaccinations, inspections, emergency responses and campaigns.
            </p>
            <Link
              href="/#portfolio"
              className="inline-flex items-center px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all shadow-xl"
            >
              Browse Activity Portfolio <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="py-10 sm:py-14 px-4 sm:px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <HeartPulse className="text-white w-4 h-4" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900 uppercase">Vet-Hub</span>
          </div>
          <p className="text-slate-400 font-medium text-sm text-center">
            &copy; {new Date().getFullYear()} Thanjavur Circle · All rights reserved
          </p>
          <div className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">Portal</Link>
            <Link href="/story" className="text-slate-900">Our Story</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
