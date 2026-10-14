import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CAMPUS_METADATA } from '../data/campusData';
import { Compass, Lock, Mail, User as UserIcon, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, signup, quickDemoLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'student' | 'faculty' | 'visitor'>('student');
  const [signupDept, setSignupDept] = useState('Computer Science & Artificial Intelligence (CAI)');
  const [signupRoll, setSignupRoll] = useState('');
  
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Status & error states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!loginEmail.trim()) {
      setErrorMessage("Please enter your registered email or Roll Number.");
      return;
    }
    if (!loginPassword) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || "Login failed. Please check credentials.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!signupName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const result = await signup({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: signupRole,
      department: signupDept,
      studentId: signupRoll.trim() || undefined
    });
    setLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || "Signup failed. Please try again.");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMessage("Please provide a valid registered email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForgotSent(true);
      setErrorMessage(null);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Left Column: Campus Showcase & Academic Identity */}
      <div className="lg:w-1/2 relative bg-slate-900 text-white flex flex-col justify-between p-8 sm:p-12 overflow-hidden">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img 
            src={CAMPUS_METADATA.heroImage} 
            alt="KIET Campus Gate" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
        </div>

        {/* Top Header / Emblem */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg text-white">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">KIET CampusNav</h1>
              <p className="text-xs text-blue-300 font-medium">Campus Navigation & Route Planner</p>
            </div>
          </div>
        </div>

        {/* Center Editorial Focus */}
        <div className="relative z-10 my-10 lg:my-0 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
            <Building2 className="w-3.5 h-3.5" />
            <span>Kakinada Institute of Engineering & Technology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Find your way across campus with intelligent graph navigation.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Designed for KIET students, faculty, and visitors. Query directions, find departments and laboratories, calculate shortest walking paths, and inspect campus routes.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="font-semibold text-white block mb-0.5">Shortest Path Engine</span>
              <span>Graph-based algorithm on campus pathways</span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="font-semibold text-white block mb-0.5">Campus Chatbot</span>
              <span>Natural language queries for departments & labs</span>
            </div>
          </div>
        </div>

        {/* Bottom Academic Notice */}
        <div className="relative z-10 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Korangi, Kakinada, Andhra Pradesh</span>
          <span className="text-slate-400">KIET Campus Navigation System</span>
        </div>
      </div>

      {/* Right Column: Authentication Card & Forms */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Form Header */}
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === 'login' && "Sign In to KIET CampusNav"}
              {mode === 'signup' && "Create Student / Faculty Account"}
              {mode === 'forgot' && "Reset Account Password"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {mode === 'login' && "Enter your college credentials to access campus navigation."}
              {mode === 'signup' && "Register to save search routes and get personalized guidance."}
              {mode === 'forgot' && "Enter your email to receive recovery instructions."}
            </p>
          </div>

          {/* Quick Demo Credentials for Fast Viva / Evaluation Testing */}
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Quick Test Logins (1-Click Demo)
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">Quick Login</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin('student')}
                className="px-2.5 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs text-center"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('faculty')}
                className="px-2.5 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs text-center"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('visitor')}
                className="px-2.5 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs text-center"
              >
                Visitor
              </button>
            </div>
          </div>

          {/* Error Message Callout */}
          {errorMessage && (
            <div className="p-3 text-xs rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Mode: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College Email or Roll Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@kiet.edu.in or 22B91A4201"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMessage(null); }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Login to CampusNav"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMessage(null); }}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create new account
                </button>
              </div>
            </form>
          )}

          {/* Mode: SIGNUP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Aditya Varma"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="visitor">Visitor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Roll No / Emp ID
                  </label>
                  <input
                    type="text"
                    value={signupRoll}
                    onChange={(e) => setSignupRoll(e.target.value)}
                    placeholder="22B91A4201"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={signupDept}
                  onChange={(e) => setSignupDept(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                >
                  <option value="Computer Science & Artificial Intelligence (CAI)">CAI - AI & Machine Learning</option>
                  <option value="Computer Science & Engineering (CSE)">CSE - Computer Science & Engg</option>
                  <option value="Basic Sciences & Humanities">Basic Sciences & Humanities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="your.email@kiet.edu.in"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password (min 6 characters)
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Complete Registration"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(null); }}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Mode: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotSent ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Password Reset Link Sent</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    A simulation password reset link has been dispatched to <span className="font-mono">{forgotEmail}</span>. In the actual deployment, an OTP will be verified.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setForgotSent(false); }}
                    className="mt-3 px-4 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@kiet.edu.in"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Send Reset Instructions"}
                  </button>
                  <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                    Remember your password?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMessage(null); }}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
