"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

const SITE_NAME = "TuliaStays"; // TODO: badilisha na jina halisi la brand

export default function AdminAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "Email au password si sahihi."
        : error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Account imeundwa! Angalia email yako uconfirm, kisha Sign In."
    );
    setMode("signin");
  };

  return (
    <div className="relative min-h-screen bg-[#0B1020] text-white flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* ambient glow orbs */}
      <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-blue-600/20 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 -right-10 w-56 h-56 rounded-full bg-amber-500/15 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo / brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center font-bold italic text-lg shadow-lg mb-3">
            {SITE_NAME.slice(0, 2).toUpperCase()}
          </div>
          <h1 className="text-xl font-bold">{SITE_NAME} Admin</h1>
          <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
            <ShieldCheck size={12} /> Restricted access — property management only
          </p>
        </div>

        {/* Glass card */}
        <div className="bg-[#131B30]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Tab switcher */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("signin"); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "signin"
                  ? "bg-white/10 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-white/10 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "signin" ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "signin" ? 12 : -12 }}
              transition={{ duration: 0.25 }}
              onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
              className="flex flex-col gap-4"
            >
              {mode === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-400">Full Name</label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-amber-500/50 transition-colors">
                    <User size={15} className="text-slate-500 shrink-0" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jina lako kamili"
                      className="bg-transparent outline-none text-white placeholder:text-slate-500 text-sm w-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Email</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-amber-500/50 transition-colors">
                  <Mail size={15} className="text-slate-500 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="bg-transparent outline-none text-white placeholder:text-slate-500 text-sm w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Password</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-amber-500/50 transition-colors">
                  <Lock size={15} className="text-slate-500 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent outline-none text-white placeholder:text-slate-500 text-sm w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2"
                  >
                    {success}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="mt-1 w-full bg-gradient-to-br from-blue-600 to-blue-500 hover:brightness-110 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.35)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : mode === "signin" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          {SITE_NAME} property management — not for guest accounts.
        </p>
      </motion.div>
    </div>
  );
}