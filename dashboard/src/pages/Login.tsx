import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HeartPulse, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      window.dispatchEvent(new Event("storage"));
      navigate(`/dashboard/${data.role.toLowerCase()}`);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      {/* Left side: Branding panel (hidden below lg) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-end overflow-hidden">
        <img
          src="/Users/daniyal/.gemini/antigravity/brain/43953b29-39d4-4686-84cb-36504f0919ac/vet_hub_login_bg_1775370088920.png"
          alt="Veterinary clinic"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 p-12 text-white">
          <div className="flex items-center mb-8 space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">Vet-Hub</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-5 tracking-tight">
            Operational Excellence in <span className="text-blue-400">Veterinary Care</span>.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-md">
            Streamlined activity reporting and administrative oversight for modern veterinary circles.
          </p>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="p-3 bg-blue-600 rounded-2xl mb-4">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Vet-Hub</h1>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-base">Sign in to manage your circle's activities.</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 w-[18px] h-[18px] text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="staff@vethub.org"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Connect Securely
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Are you an audience member?{" "}
              <a href={import.meta.env.VITE_PORTAL_URL} className="text-blue-600 font-bold hover:underline">
                Visit Public Portal
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
