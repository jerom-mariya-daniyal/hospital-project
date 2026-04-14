import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Bell,
  Plus,
  X,
  Send,
  Loader2,
  AlertTriangle,
  Info,
  MessageSquare,
  Eye,
  Users,
  Shield,
  CheckCheck,
  ArrowLeft,
  Clock,
  ChevronRight,
  Hash,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

/* ────────────────────────────────────────────────────────── types ── */
interface ViewEntry {
  user: { _id: string; name: string; role: string };
  readAt: string;
}

interface FollowUp {
  _id: string;
  message: string;
  author: { _id?: string; name: string; role: string };
  createdAt: string;
}

interface Circular {
  _id: string;
  title: string;
  body: string;
  attachments: string[];
  priority: "Normal" | "Urgent" | "Critical";
  recipients: "ALL" | "STAFF" | "ADMIN";
  author: { _id?: string; name: string; role: string };
  followUps: FollowUp[];
  readBy: string[];
  viewLog: ViewEntry[];
  createdAt: string;
}

/* ────────────────────────────────────────────────────── meta maps ── */
const PRIORITY_META = {
  Normal:   { color: "text-slate-600",  bg: "bg-slate-100",  border: "border-slate-200", bar: "bg-slate-300",   dot: "bg-slate-400"  },
  Urgent:   { color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200", bar: "bg-amber-400",   dot: "bg-amber-500"  },
  Critical: { color: "text-red-700",    bg: "bg-red-50",     border: "border-red-200",   bar: "bg-red-500",     dot: "bg-red-500"    },
};

const RECIPIENT_META = {
  ALL:   { label: "Everyone",   icon: Users,   color: "text-blue-700",   bg: "bg-blue-50"   },
  STAFF: { label: "Staff Only", icon: Users,   color: "text-purple-700", bg: "bg-purple-50" },
  ADMIN: { label: "Admin Only", icon: Shield,  color: "text-slate-700",  bg: "bg-slate-100" },
};

/* ───────────────────────────────────────────── avatar helper ── */
const AVATAR_COLORS = [
  "bg-blue-500","bg-emerald-500","bg-violet-500","bg-amber-500",
  "bg-rose-500","bg-cyan-500","bg-fuchsia-500","bg-teal-500",
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} ${avatarColor(name)} rounded-full flex items-center justify-center font-bold text-white shrink-0 ring-2 ring-white`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/* ─────────────── Readers Panel ────────────────────────────────── */
function ReadersPanel({ viewLog, total }: { viewLog: ViewEntry[]; total: number }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? viewLog : viewLog.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-50">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          Seen By
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
            {viewLog.length}
          </span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">{total} recipients total</span>
      </div>

      <div className="p-4">
        {viewLog.length === 0 ? (
          <div className="text-center py-5">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-xs text-slate-400 font-medium">No one has read this yet</p>
          </div>
        ) : (
          <>
            {/* Avatar stack */}
            <div className="flex items-center mb-4">
              <div className="flex -space-x-2">
                {viewLog.slice(0, 7).map((v, i) => (
                  <div key={i} title={v.user?.name} className="ring-2 ring-white rounded-full">
                    <Avatar name={v.user?.name || "?"} size="sm" />
                  </div>
                ))}
                {viewLog.length > 7 && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 ring-2 ring-white flex items-center justify-center text-[10px] font-black text-slate-600">
                    +{viewLog.length - 7}
                  </div>
                )}
              </div>
              <span className="ml-3 text-xs font-semibold text-slate-500">
                {viewLog.length === 1 ? "1 person" : `${viewLog.length} people`} have read this
              </span>
            </div>

            {/* Detailed list */}
            <div className="space-y-2">
              {visible.map((v, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <Avatar name={v.user?.name || "?"} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{v.user?.name || "Unknown"}</p>
                    <p className="text-[10px] text-slate-400 font-medium capitalize">
                      {v.user?.role?.toLowerCase() || "staff"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCheck className="w-3 h-3" />
                      Read
                    </p>
                    <p className="text-[10px] text-slate-400">{timeAgo(v.readAt)}</p>
                  </div>
                </div>
              ))}
            </div>

            {viewLog.length > 5 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 w-full text-center text-xs font-bold text-blue-600 hover:text-blue-800 py-1.5 transition-colors"
              >
                {expanded ? "Show less ↑" : `Show ${viewLog.length - 5} more ↓`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ──────────────────── Chat Bubble ─────────────────────────────── */
function ChatBubble({ msg, isMine }: { msg: FollowUp; isMine: boolean }) {
  const authorName = msg.author?.name || "Staff";
  const roleLabel = (msg.author?.role || "STAFF").toLowerCase();

  return (
    <div className={`flex items-end gap-2.5 ${isMine ? "flex-row-reverse" : "flex-row"} group`}>
      <div className="shrink-0 mb-1">
        <Avatar name={authorName} size="sm" />
      </div>
      <div className={`flex flex-col max-w-[75%] ${isMine ? "items-end" : "items-start"}`}>
        {/* Name + time */}
        <div className={`flex items-center gap-2 mb-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[11px] font-bold text-slate-700">{isMine ? "You" : authorName}</span>
          <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{formatTime(msg.createdAt)}</span>
          <span className="text-[10px] text-slate-300 capitalize">· {roleLabel}</span>
        </div>
        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
            isMine
              ? "bg-slate-900 text-white rounded-br-sm"
              : "bg-slate-100 text-slate-800 rounded-bl-sm hover:bg-slate-150"
          }`}
        >
          {msg.message}
        </div>
        {/* Delivery status for mine */}
        {isMine && (
          <div className="flex items-center gap-1 mt-0.5">
            <CheckCheck className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-slate-400">Delivered</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Component ───────────────────── */
export default function CircularsPage({ role }: { role: string | null }) {
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Circular | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [followUpText, setFollowUpText] = useState("");
  const [sendingFollowUp, setSendingFollowUp] = useState(false);
  const [showReadersPanel, setShowReadersPanel] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Create form state
  const [form, setForm] = useState({
    title: "",
    body: "",
    priority: "Normal" as "Normal" | "Urgent" | "Critical",
    recipients: "ALL" as "ALL" | "STAFF" | "ADMIN",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const token = () => localStorage.getItem("token");
  const getMyId = useCallback(() => {
    try {
      const t = token();
      if (!t) return null;
      return JSON.parse(atob(t.split(".")[1])).id;
    } catch { return null; }
  }, []);
  const getMyName = useCallback(() => {
    try {
      const t = token();
      if (!t) return null;
      return JSON.parse(atob(t.split(".")[1])).name;
    } catch { return null; }
  }, []);

  const myId = getMyId();

  const fetchCirculars = useCallback(async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/circulars`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setCirculars(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCirculars(); }, [fetchCirculars]);

  // Auto-scroll chat to bottom when follow-ups change
  useEffect(() => {
    if (selected) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected?.followUps.length]);

  const openCircular = async (c: Circular) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/circulars/${c._id}/read`, {}, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/circulars/${c._id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setSelected(data);
      setShowReadersPanel(false);
      setCirculars(prev =>
        prev.map(item => item._id === c._id ? { ...item, readBy: [...item.readBy, myId || ""] } : item)
      );
    } catch { setSelected(c); }
  };

  const handleFollowUp = async () => {
    if (!followUpText.trim() || !selected) return;
    setSendingFollowUp(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/circulars/${selected._id}/followup`,
        { message: followUpText },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setSelected(prev => prev ? { ...prev, followUps: [...prev.followUps, data] } : prev);
      setFollowUpText("");
    } catch { /* silent */ }
    finally { setSendingFollowUp(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/circulars`, form, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setCirculars(prev => [data, ...prev]);
      setForm({ title: "", body: "", priority: "Normal", recipients: "ALL" });
      setShowCreate(false);
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create circular.");
    } finally { setCreating(false); }
  };

  const isMyCircular = (c: Circular) => c.author?._id === myId;
  const unreadCount = circulars.filter(c => !c.readBy.includes(myId || "")).length;

  /* ────────────────── loading ── */
  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );

  /* ────────────────── detail view ── */
  if (selected) {
    const pm = PRIORITY_META[selected.priority];
    const rm = RECIPIENT_META[selected.recipients];
    const RecipientIcon = rm.icon;
    const isAuthor = isMyCircular(selected);

    // Group consecutive messages by the same author
    const canSeeReaders = role === "ADMIN" || isAuthor;

    return (
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto h-full">
        {/* ─── Main column ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Back */}
          <button
            onClick={() => { setSelected(null); fetchCirculars(); }}
            className="group flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors self-start"
          >
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Circulars
          </button>

          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className={`h-1.5 w-full ${pm.bar}`} />
            <div className="p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${pm.bg} ${pm.color} ${pm.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pm.dot}`} />
                  {selected.priority}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${rm.bg} ${rm.color}`}>
                  <RecipientIcon className="w-3.5 h-3.5" />
                  {rm.label}
                </span>
                {canSeeReaders && (
                  <button
                    onClick={() => setShowReadersPanel(v => !v)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors lg:hidden ${
                      showReadersPanel ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {selected.viewLog?.length || 0} saw this
                  </button>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                {selected.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 border-t border-slate-50 text-sm">
                <div className="flex items-center gap-2.5">
                  <Avatar name={selected.author?.name || "?"} size="sm" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issued by</p>
                    <p className="text-sm font-bold text-slate-900">{selected.author?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{formatDate(selected.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{selected.viewLog?.length || 0} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-4 h-4 text-slate-300" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Content</h3>
            </div>
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: selected.body }}
            />
          </div>

          {/* ── Readers panel (mobile only, toggleable) ── */}
          {canSeeReaders && showReadersPanel && (
            <div className="lg:hidden">
              <ReadersPanel viewLog={selected.viewLog || []} total={circulars.length} />
            </div>
          )}

          {/* ── Follow-up Chat ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            {/* Chat header */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center gap-3">
              <div className="p-1.5 bg-slate-900 rounded-lg">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Team Discussion</h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {selected.followUps.length} {selected.followUps.length === 1 ? "reply" : "replies"}
                </p>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-5 space-y-5 overflow-y-auto min-h-[220px] max-h-[420px]">
              {selected.followUps.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                    <MessageSquare className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-500">No replies yet</p>
                  <p className="text-xs text-slate-400 mt-1">Be the first to respond to this circular</p>
                </div>
              ) : (
                <>
                  {selected.followUps.map((msg, i) => {
                    const isMine = msg.author?._id === myId || msg.author?.name === getMyName();
                    const prevMsg = selected.followUps[i - 1];
                    const showDateSep =
                      !prevMsg ||
                      new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();
                    return (
                      <div key={msg._id || i}>
                        {showDateSep && (
                          <div className="flex items-center gap-3 my-3">
                            <div className="flex-1 h-px bg-slate-100" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                            <div className="flex-1 h-px bg-slate-100" />
                          </div>
                        )}
                        <ChatBubble msg={msg} isMine={isMine} />
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Input area */}
            <div className="px-4 pb-4 pt-3 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-end gap-2">
                <div className="shrink-0">
                  <Avatar name={getMyName() || "Me"} size="sm" />
                </div>
                <div className="flex-1 relative">
                  <textarea
                    rows={1}
                    value={followUpText}
                    onChange={(e) => {
                      setFollowUpText(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleFollowUp();
                      }
                    }}
                    placeholder="Write a reply... (Enter to send, Shift+Enter for new line)"
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all resize-none overflow-hidden leading-relaxed"
                    style={{ minHeight: "44px" }}
                  />
                  {followUpText && (
                    <div className="absolute bottom-2 right-3 text-[10px] text-slate-300 font-medium">
                      {followUpText.length} · Enter ↵
                    </div>
                  )}
                </div>
                <button
                  onClick={handleFollowUp}
                  disabled={!followUpText.trim() || sendingFollowUp}
                  className="shrink-0 w-11 h-11 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-slate-700 disabled:opacity-40 transition-all active:scale-95 shadow-sm"
                >
                  {sendingFollowUp ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-2 ml-11">
                Press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-black">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-black">Shift+Enter</kbd> for new line
              </p>
            </div>
          </div>
        </div>

        {/* ─── Right sidebar: Readers (desktop) ── */}
        {canSeeReaders && (
          <div className="hidden lg:block w-72 xl:w-80 shrink-0 self-start sticky top-6">
            <ReadersPanel viewLog={selected.viewLog || []} total={circulars.length} />
          </div>
        )}
      </div>
    );
  }

  /* ────────────────── list view ── */
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Internal Circulars
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 bg-blue-600 text-white text-sm font-bold rounded-full animate-pulse">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
            Official notices and internal documents.
          </p>
        </div>
        {role === "ADMIN" && (
          <button
            onClick={() => setShowCreate(s => !s)}
            className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-sm self-start sm:self-auto shrink-0 active:scale-95"
          >
            {showCreate ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> New Circular</>}
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreate && role === "ADMIN" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl text-white"><Bell className="w-4 h-4" /></div>
            <h2 className="font-black text-slate-900 text-base">New Circular</h2>
          </div>
          <form onSubmit={handleCreate} className="p-5 sm:p-6 space-y-5">
            {createError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 text-sm font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />{createError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Title</label>
              <input
                type="text" required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Q2 Vaccination Drive Announcement"
                className="w-full px-4 py-3 text-sm font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Priority</label>
                <div className="flex gap-2">
                  {(["Normal","Urgent","Critical"] as const).map(p => {
                    const pm = PRIORITY_META[p];
                    return (
                      <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          form.priority === p ? `${pm.bg} ${pm.color} ${pm.border} shadow-sm` : "border-slate-200 text-slate-400 hover:border-slate-400"
                        }`}
                      >{p}</button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Recipients</label>
                <div className="flex gap-2">
                  {(["ALL","STAFF","ADMIN"] as const).map(r => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, recipients: r })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        form.recipients === r ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "border-slate-200 text-slate-400 hover:border-slate-400"
                      }`}
                    >{r === "ALL" ? "All" : r === "STAFF" ? "Staff" : "Admin"}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Content</label>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <ReactQuill theme="snow" value={form.body}
                  onChange={val => setForm({ ...form, body: val })}
                  placeholder="Write the circular content here..." />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-700 font-medium">
                Sent to {form.recipients === "ALL" ? "all staff and admins" : form.recipients === "STAFF" ? "staff only" : "admins only"}.
              </p>
            </div>

            <button type="submit" disabled={creating || !form.title || !form.body}
              className="w-full flex justify-center items-center py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg disabled:opacity-60 active:scale-99"
            >
              {creating ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Publishing...</> : <><Bell className="w-4 h-4 mr-2" />Publish Circular</>}
            </button>
          </form>
        </div>
      )}

      {/* Circular List */}
      {circulars.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm">
          <Bell className="w-14 h-14 text-slate-200 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-700">No circulars yet</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            {role === "ADMIN" ? "Create your first circular to notify the team." : "No circulars have been issued yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {circulars.map(c => {
            const pm = PRIORITY_META[c.priority];
            const rm = RECIPIENT_META[c.recipients];
            const isUnread = !c.readBy.includes(myId || "");
            const RecipientIcon = rm.icon;
            const viewCount = c.viewLog?.length || 0;

            return (
              <button key={c._id} onClick={() => openCircular(c)}
                className={`w-full text-left bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group ${
                  isUnread ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className={`h-1 w-full ${pm.bar}`} />
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {isUnread && <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 animate-pulse" />}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${pm.bg} ${pm.color} ${pm.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pm.dot}`} />{c.priority}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${rm.bg} ${rm.color}`}>
                        <RecipientIcon className="w-3 h-3" />{rm.label}
                      </span>
                    </div>
                    <h3 className={`font-bold text-base leading-tight truncate group-hover:text-blue-700 transition-colors ${isUnread ? "text-slate-900" : "text-slate-700"}`}>
                      {c.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={c.author?.name || "?"} size="sm" />
                        <span>{c.author?.name}</span>
                      </div>
                      <span>·</span>
                      <span>{timeAgo(c.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-slate-400">
                    <div className="flex items-center gap-1.5 text-xs font-medium" title={`${viewCount} people read this`}>
                      <Eye className="w-4 h-4" />
                      <span>{viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium" title={`${c.followUps?.length || 0} replies`}>
                      <MessageSquare className="w-4 h-4" />
                      <span>{c.followUps?.length || 0}</span>
                    </div>
                    {isUnread
                      ? <Eye className="w-4 h-4 text-blue-500" />
                      : <CheckCheck className="w-4 h-4 text-emerald-500" />
                    }
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
