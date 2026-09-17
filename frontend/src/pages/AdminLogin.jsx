import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdShield, MdError } from 'react-icons/md';
import heroImage from '../assets/Hero.jpeg';

/**
 * AdminLogin — accessible only at /admin-login
 * This page is NOT linked anywhere in the UI.
 * Only authorized staff who know the URL can access it.
 */
const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result?.success) {
      const role = result.user?.role;
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        // Non-admin tried the admin portal
        setError('Access denied. This portal is for authorized administrators only.');
      }
    } else {
      setError(result?.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#1a1008]">

      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

      <div className="relative w-full max-w-sm space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-800 border border-gold/30 rounded-2xl shadow-2xl">
            <MdShield className="w-8 h-8 text-gold" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl text-parchment uppercase tracking-widest">
              Admin Portal
            </h1>
            <p className="text-[10px] text-stone-500 font-semibold tracking-widest uppercase">Museum 150 — Authorized Access Only</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-700 shadow-2xl rounded-2xl p-8 space-y-5">

          {error && (
            <div className="bg-red-950/60 border border-red-700/50 text-red-400 text-xs font-semibold px-4 py-3 rounded-xl">
              <MdError className="inline w-4 h-4 mr-1" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 block uppercase tracking-widest">Administrator Email</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
                <input
                  type="email" required autoComplete="username"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@museum150.lk"
                  className="w-full text-sm pl-9 pr-4 py-3 rounded-xl border border-stone-600 bg-stone-800 text-parchment placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-gold/60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 block uppercase tracking-widest">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-9 pr-10 py-3 rounded-xl border border-stone-600 bg-stone-800 text-parchment placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-gold/60"
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-3.5 text-stone-500 hover:text-stone-300 transition-colors">
                  {showPw ? <MdVisibilityOff className="w-4 h-4" /> : <MdVisibility className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gold text-primary font-bold py-3 rounded-xl hover:bg-amber-500 transition-colors uppercase tracking-widest text-xs shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" /> Verifying...</>
                : <><MdShield className="w-4 h-4" /> Access Control Panel</>
              }
            </button>
          </form>
        </div>

        {/* Small warning footer */}
        <p className="text-[10px] text-stone-600 text-center font-mono">
          Unauthorized access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
