import { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  FilePlus, 
  ClipboardCheck, 
  HeartPulse,
  ChevronRight,
  Settings,
  Bell,
  BellOff,
  Menu,
  X,
  Loader2,
} from "lucide-react";

export default function DashboardWrapper({ role }: { role: string | null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [togglingNotif, setTogglingNotif] = useState(false);
  const [notifToast, setNotifToast] = useState<string | null>(null);

  const token = () => localStorage.getItem("token");

  // Fetch current user preferences on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token()}` },
        });
        setEmailNotifications(data.emailNotifications ?? true);
      } catch { /* silent if endpoint doesn't respond */ }
    })();
  }, []);

  const showToast = useCallback((msg: string) => {
    setNotifToast(msg);
    setTimeout(() => setNotifToast(null), 3000);
  }, []);

  const toggleNotifications = async () => {
    setTogglingNotif(true);
    try {
      const { data } = await axios.put(
        "http://localhost:5001/api/auth/me/notifications",
        {},
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setEmailNotifications(data.emailNotifications);
      showToast(data.emailNotifications ? "Email alerts turned on" : "Email alerts muted");
    } catch {
      showToast("Could not update preference");
    } finally {
      setTogglingNotif(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const menuItems = [
    { label: "Overview",       path: "/dashboard/analytics",  icon: LayoutDashboard, show: role === "ADMIN" },
    { label: "Review Queue",   path: "/dashboard/admin",      icon: ClipboardCheck,  show: role === "ADMIN" },
    { label: "Circle Members", path: "/dashboard/users",      icon: Users,           show: role === "ADMIN" },
    { label: "New Report",     path: "/dashboard/staff",      icon: FilePlus,        show: role === "STAFF" },
    { label: "Circulars",      path: "/dashboard/circulars",  icon: Bell,            show: true },
  ];

  const NavLink = ({ item }: { item: typeof menuItems[0] }) => {
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setMobileSidebarOpen(false)}
        className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all group text-sm ${
          active
            ? "bg-slate-900 text-white shadow-lg"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <div className="flex items-center min-w-0">
          <item.icon className={`w-5 h-5 mr-3 shrink-0 transition-colors ${active ? "text-blue-400" : "text-slate-400 group-hover:text-slate-700"}`} />
          <span className="truncate">{item.label}</span>
        </div>
        {active && <ChevronRight className="w-4 h-4 opacity-50 shrink-0 ml-2" />}
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center min-w-0">
          <div className="p-2 bg-blue-600 rounded-xl mr-3 shrink-0">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900 truncate">Vet-Hub</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 ml-2 shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 pt-5 pb-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operations</p>
        {menuItems.filter(i => i.show).map(item => (
          <NavLink key={item.path} item={item} />
        ))}

        <div className="pt-5 mt-5 border-t border-slate-100 space-y-1">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System</p>
          <button className="w-full flex items-center px-4 py-3.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <Settings className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* User Card Footer */}
      <div className="p-4 shrink-0 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-sm border-2 border-white shadow-sm shrink-0">
              {role === "ADMIN" ? "A" : "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate leading-tight">{role === "ADMIN" ? "Administrator" : "Staff Member"}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{role === "ADMIN" ? "admin@vethub.org" : "staff@vethub.org"}</p>
            </div>
            {/* Email notification toggle */}
            <button
              onClick={toggleNotifications}
              disabled={togglingNotif}
              title={emailNotifications ? "Mute email alerts" : "Enable email alerts"}
              className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                emailNotifications
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : "bg-slate-200 text-slate-400 hover:bg-slate-300"
              }`}
            >
              {togglingNotif ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : emailNotifications ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Notification status label */}
          <div className={`mt-2.5 flex items-center gap-1.5 ${emailNotifications ? "text-blue-600" : "text-slate-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${emailNotifications ? "bg-blue-500 animate-pulse" : "bg-slate-300"}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {emailNotifications ? "Email alerts on" : "Email alerts muted"}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Toast notification */}
      {notifToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 whitespace-nowrap">
          {notifToast}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen z-20 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <HeartPulse className="w-5 h-5 text-blue-600 mr-1.5 shrink-0" />
            <span className="text-base font-black tracking-tight">Vet-Hub</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Desktop Toolbar */}
        <div className="hidden lg:flex h-14 items-center justify-end px-8 space-x-5 bg-white border-b border-slate-100 sticky top-0 z-10">
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative rounded-xl hover:bg-slate-50">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center text-xs font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            <span className="text-emerald-600 uppercase tracking-widest">Operational</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full max-w-screen-2xl mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
