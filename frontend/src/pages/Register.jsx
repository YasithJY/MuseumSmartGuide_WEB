import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(name, email, password);
    setLoading(false);

    if (result?.success) {
      navigate('/profile');
    } else {
      setError(result?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-stone-200 shadow-xl rounded-2xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-3xl">🏛️</span>
          <h2 className="font-heading font-extrabold text-2xl text-primary uppercase tracking-wide">
            Register Account
          </h2>
          <p className="text-xs text-stone-500">Create a profile to log your visits and earn digital certificates.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 block">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Yasith Perera"
              className="w-full text-sm p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

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
            {loading ? 'Creating Profile...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-stone-500 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-gold font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
