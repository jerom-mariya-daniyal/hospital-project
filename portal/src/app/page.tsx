import { format } from "date-fns";
import {
  HeartPulse,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Zap,
  Globe,
  Stethoscope,
  ClipboardCheck,
  Megaphone,
  Calendar,
  User,
} from "lucide-react";
import PortfolioGrid from "./components/PortfolioGrid";
import Link from "next/link";

async function getActivities() {
  try {
    const res = await fetch("http://localhost:5001/api/activities", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const activities = await getActivities();
  const featured = activities[0] || null;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          SECTION 0 — STICKY NAV
      ═══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2 shrink-0">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <HeartPulse className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">Vet-Hub</span>
          </div>
          <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <Link href="/story"      className="hover:text-slate-900 transition-colors">Our Story</Link>
            <Link href="#portfolio" className="hover:text-slate-900 transition-colors">Portfolio</Link>
            <Link href="#process"   className="hover:text-slate-900 transition-colors">Process</Link>
            <Link href="#impact"    className="hover:text-slate-900 transition-colors">Impact</Link>
          </div>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all text-sm shrink-0">
            Get in Touch
          </button>
        </div>
      </nav>


      {/* ═══════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
          Full-viewport opening with big typography
          and a subtle scroll cue
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/hero.png"
            alt="Veterinary excellence"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto w-full pt-32">
          <div className="inline-flex items-center px-3 py-1.5 bg-blue-600/10 text-blue-700 rounded-full text-xs font-bold tracking-widest uppercase mb-6 sm:mb-8">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Thanjavur Circle · Est. 2024
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1.05] text-slate-900 max-w-4xl">
            Where compassion <br className="hidden sm:block" />
            meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">clinical precision</span>.
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
            An open window into the daily operations, emergency responses and preventive healthcare initiatives of our veterinary circle.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap gap-4">
            <Link href="#portfolio" className="group inline-flex items-center px-7 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl transition-all hover:shadow-2xl">
              Explore Our Work
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/story" className="inline-flex items-center px-7 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
              Read Our Story
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <ArrowDown className="w-5 h-5 text-slate-300" />
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 2 — EDITORIAL MARQUEE
          A thin horizontal band with scrolling facts
      ═══════════════════════════════════════════ */}
      <div className="bg-slate-900 py-4 overflow-hidden">
        <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center shrink-0">
              {["1,200+ Field Reports", "100% Transparency", "15,000+ Vaccinations", "24/7 Emergency Response", "84 Community Events"].map((item, i) => (
                <span key={i} className="mx-8 text-xs font-bold text-white/70 uppercase tracking-[0.3em] flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>


      {/* ═══════════════════════════════════════════
          SECTION 3 — OUR STORY
          Asymmetric text-left / image-right with
          generous vertical breathing room
      ═══════════════════════════════════════════ */}
      <section id="story" className="py-24 sm:py-32 lg:py-44 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div className="order-2 lg:order-1">
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Our Origin</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-6">
                Born from the fields, <br className="hidden lg:block" />
                built for the herd.
              </h2>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-medium mb-6">
                Thanjavur Circle was established to bring systematic, transparent veterinary care to one of India's most vital agricultural regions. We believe every animal deserves documented, accountable healthcare — and every community deserves to see exactly where its resources go.
              </p>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-medium mb-8">
                This portal is our open ledger. Every vaccination drive, every emergency response, every routine inspection is recorded here — not for us, but for you. Because trust isn't claimed, it's shown.
              </p>
              <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-3xl font-black text-slate-900">2024</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Circle Founded</p>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div>
                  <p className="text-3xl font-black text-slate-900">12</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active Staff</p>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div>
                  <p className="text-3xl font-black text-slate-900">∞</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Commitment</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/5]">
                <img
                  src="/mission.png"
                  alt="Thanjavur farmland"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/80 to-transparent">
                  <p className="text-white text-sm font-bold">Dawn over the Thanjavur plains</p>
                  <p className="text-white/60 text-xs mt-0.5">Where our circle begins every day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 4 — FEATURED ACTIVITY
          Full-bleed hero card for the latest report
      ═══════════════════════════════════════════ */}
      {featured && (
        <section className="bg-slate-50 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Latest from the Field</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-10 lg:mb-14">Featured Report</h2>

            <Link href={`/activities/${featured._id}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-shadow duration-500">
                {/* Image — 3/5 width */}
                <div className="lg:col-span-3 aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100">
                  {featured.images && featured.images.length > 0 ? (
                    <img
                      src={featured.images[0]}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                      <HeartPulse className="w-16 h-16 text-slate-200" />
                    </div>
                  )}
                </div>

                {/* Content — 2/5 width */}
                <div className="lg:col-span-2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(featured.createdAt), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                    {featured.title}
                  </h3>
                  <div
                    className="text-base text-slate-500 leading-relaxed font-medium line-clamp-4 mb-8"
                    dangerouslySetInnerHTML={{ __html: featured.description }}
                  />
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-8">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                      {(featured.author?.name || "S").charAt(0)}
                    </div>
                    <span>By <strong className="text-slate-900">{featured.author?.name || "Staff"}</strong></span>
                  </div>
                  <span className="inline-flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                    Read Full Report <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════
          SECTION 5 — EDITORIAL QUOTE
          Full-width typographic breather
      ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-200 text-7xl sm:text-8xl lg:text-9xl font-black leading-none select-none mb-8">"</p>
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug -mt-16 sm:-mt-20">
            The measure of a society is found in how it treats its weakest and most helpless members.
          </blockquote>
          <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">— Mahatma Gandhi</p>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 6 — PORTFOLIO GRID
          Client component with working tag filters
      ═══════════════════════════════════════════ */}
      <PortfolioGrid />


      {/* ═══════════════════════════════════════════
          SECTION 7 — OUR PROCESS
          Image left, timeline right — editorial feel
      ═══════════════════════════════════════════ */}
      <section id="process" className="py-24 sm:py-32 lg:py-44 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-square sm:aspect-[4/5]">
              <img src="/process.png" alt="Veterinary care in action" className="w-full h-full object-cover" />
            </div>

            {/* Timeline */}
            <div>
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">How It Works</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-10">
                From the field <br className="hidden lg:block" />
                to your screen.
              </h2>

              <div className="space-y-8">
                {[
                  { icon: Stethoscope,    step: "01", title: "Field Operation",      desc: "Our veterinary staff conduct inspections, vaccinations, and emergency treatments across the Thanjavur circle." },
                  { icon: ClipboardCheck,  step: "02", title: "Digital Documentation", desc: "Every activity is logged with rich-text narratives, multiple photographs, and operational metadata." },
                  { icon: ShieldCheck,     step: "03", title: "Administrative Review", desc: "Reports undergo administrative verification to ensure accuracy and completeness before publication." },
                  { icon: Megaphone,       step: "04", title: "Public Broadcast",      desc: "Verified reports appear here — on this portal — creating an immutable and transparent record for all." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <item.icon className="w-5 h-5" />
                      </div>
                      {i < 3 && <div className="w-px h-full bg-slate-200 mt-2" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Step {item.step}</p>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 8 — IMPACT STATS
          Dark cinematic section
      ═══════════════════════════════════════════ */}
      <section id="impact" className="bg-slate-900 py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[200px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[200px] opacity-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 lg:mb-20">
            <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Quantifying our service.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg font-medium max-w-lg mx-auto">
              Every number below represents a real outcome — a real animal treated, a real community served.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { val: "1.2k+", label: "Field Reports",     sub: "Documented since inception" },
              { val: "15k+",  label: "Vaccinations",       sub: "Across all rural sectors" },
              { val: "84",    label: "Community Events",   sub: "Public health campaigns" },
              { val: "100%",  label: "Verified & Open",    sub: "Zero reports redacted" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
                <p className="text-4xl sm:text-5xl font-black text-white mb-2">{stat.val}</p>
                <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">{stat.label}</p>
                <p className="text-slate-500 text-[10px] sm:text-xs mt-2 font-medium">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 9 — VALUES STRIP
          Three-column luxury editorial cards
      ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 lg:mb-20">
            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">What We Stand For</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Principles, not promises.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Radical Transparency",
                desc: "Every rupee, every procedure, every outcome — documented and published. We believe institutional trust is earned in the open.",
                num: "01",
              },
              {
                title: "Evidence-Based Care",
                desc: "Our protocols are derived from veterinary science, not convention. We measure outcomes and adapt. Data informs every decision.",
                num: "02",
              },
              {
                title: "Community First",
                desc: "We exist because the community needs us, not the other way around. Our operations are shaped by local challenges and local voices.",
                num: "03",
              },
            ].map((card, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                <p className="text-6xl font-black text-slate-100 group-hover:text-blue-100 transition-colors mb-6">{card.num}</p>
                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 10 — FINAL CTA
          Cinematic closing statement
      ═══════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-slate-900 text-center overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <img src="/mission.png" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-slate-900/80" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="p-2 bg-blue-600 rounded-2xl inline-block mb-8">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Every life documented. <br />Every action accountable.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-medium mb-10 max-w-xl mx-auto leading-relaxed">
            This portal stands as our commitment to the people of Thanjavur — a living, breathing record of care delivered with integrity.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="#portfolio" className="inline-flex items-center px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg">
              Browse All Reports
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border border-white/20 text-white rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
              Contact the Circle
            </button>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1.5 bg-blue-600 rounded-lg">
                  <HeartPulse className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tighter uppercase">Vet-Hub</span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                The official public transparency portal for the Thanjavur Circle Veterinary Division. All reports are verified and immutable.
              </p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Navigation</p>
              <ul className="space-y-3 text-sm font-medium text-slate-500">
                <li><Link href="/story" className="hover:text-slate-900 transition-colors">Our Story</Link></li>
                <li><Link href="#portfolio" className="hover:text-slate-900 transition-colors">Activity Portfolio</Link></li>
                <li><Link href="#process" className="hover:text-slate-900 transition-colors">Our Process</Link></li>
                <li><Link href="#impact" className="hover:text-slate-900 transition-colors">Impact Numbers</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Organizational</p>
              <ul className="space-y-3 text-sm font-medium text-slate-500">
                <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Data Transparency</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Internal Dashboard</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400 font-bold">
              &copy; {new Date().getFullYear()} Thanjavur Circle Veterinary Division. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              Built with integrity. Published with purpose.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
