import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ onSwitch, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      console.log('Login request:', email);

      const res = await login(email, password);

      console.log('Login response:', res);

      if (onSuccess) {
        onSuccess(res.user?.name || email.split('@')[0]);
      }
    } catch (err) {
      console.log('Login error:', err.message);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">
            FitTrack
          </h1>
          <p className="text-gray-400">
            Welcome back to your fitness journey
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-cyan-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 text-white rounded-lg"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-cyan-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 text-white rounded-lg"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <button
            onClick={() => onSwitch('register')}
            className="text-cyan-400 font-semibold"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
