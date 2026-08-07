import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, enterGuestMode } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      navigate('/profile');
    } else {
      setError(result?.message || 'Invalid credentials');
    }
  };

  const handleGuestEntry = () => {
    enterGuestMode();
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-stone-200 shadow-xl rounded-2xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-3xl">🏛️</span>
          <h2 className="font-heading font-extrabold text-2xl text-primary uppercase tracking-wide">
            Welcome Back
          </h2>
          <p className="text-xs text-stone-500">Sign in to earn experience points and unlock museum badges.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="visitor@museum150.lk"
              className="w-full text-sm p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-parchment font-bold py-3 rounded-lg hover:bg-stone-800 transition-colors uppercase tracking-wider text-xs"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-4 text-[10px] text-stone-400 font-bold uppercase tracking-wider">Or</span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        <button
          onClick={handleGuestEntry}
          className="w-full border border-gold text-primary hover:bg-gold/5 font-bold py-3 rounded-lg transition-colors uppercase tracking-wider text-xs"
        >
          Continue as Guest
        </button>

        <p className="text-xs text-stone-500 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
