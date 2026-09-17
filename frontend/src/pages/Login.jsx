import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MdMuseum, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdWarning } from 'react-icons/md';

const Login = () => {
  const { login, enterGuestMode } = useContext(AuthContext);
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
        // Admins who somehow use visitor login still go to dashboard
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: "radial-gradient(ellipse at 60% 0%, rgba(201,162,39,0.08), transparent 60%)" }}>

      <div className="w-full max-w-md space-y-6">

        {/* Museum branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-1">
            <MdMuseum className="w-8 h-8 text-gold" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-primary dark:text-parchment uppercase tracking-wide">
              Museum 150
            </h1>
            <p className="text-xs text-stone-400 dark:text-stone-500 font-semibold tracking-widest uppercase">Smart Guide Portal</p>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
            Sign in to track your visits, earn badges and explore Sri Lanka's cultural heritage.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-2xl p-8 space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
              <MdWarning className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="visitor@museum150.lk"
                  className="w-full text-sm pl-9 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-gold bg-stone-50 dark:bg-stone-700 dark:text-parchment dark:placeholder-stone-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wide">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-9 pr-10 py-3 rounded-xl border border-stone-200 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-gold bg-stone-50 dark:bg-stone-700 dark:text-parchment dark:placeholder-stone-500"
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-600 transition-colors">
                  {showPw ? <MdVisibilityOff className="w-4 h-4" /> : <MdVisibility className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-parchment font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors uppercase tracking-wider text-xs shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
                : <><MdMuseum className="w-4 h-4" /> Sign In to Museum Guide</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-100 dark:border-stone-700"></div>
            <span className="mx-4 text-[10px] text-stone-400 font-bold uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-stone-100 dark:border-stone-700"></div>
          </div>

          {/* Guest mode */}
          <button onClick={() => { enterGuestMode?.(); navigate('/'); }}
            className="w-full border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 font-bold py-3 rounded-xl transition-colors uppercase tracking-wider text-xs">
            Continue as Guest (Browse Only)
          </button>
        </div>

        {/* Register link */}
        <p className="text-xs text-stone-500 dark:text-stone-400 text-center">
          New visitor?{' '}
          <Link to="/register" className="text-gold font-bold hover:underline">
            Create a free account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
