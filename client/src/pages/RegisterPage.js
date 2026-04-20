import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const RegisterPage = ({ onSwitch, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log('Register form submitted');

      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      setSuccess('Creating your account...');
      const response = await register(name, email, password);
      console.log('Register response:', response);

      setSuccess('Account created successfully!');
      setLoading(false);

      if (onSuccess) {
        onSuccess(response.user?.name || name);
      }
    } catch (err) {
      console.log('Register error:', err.message);
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">FitTrack</span>
          </h1>
          <p className="text-gray-400">Start your fitness journey today</p>
        </div>

        <div className="flex gap-4 mb-6 bg-slate-800/50 p-1 rounded-lg">
          <button
            onClick={() => onSwitch && onSwitch('login')}
            className="flex-1 py-2 px-4 text-gray-400 hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => onSwitch && onSwitch('register')}
            className="flex-1 py-2 px-4 bg-cyan-500 text-white rounded-md font-semibold transition"
          >
            Register
          </button>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-300">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-300">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-cyan-500" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:bg-slate-700/80 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-cyan-500" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:bg-slate-700/80 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-cyan-500" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:bg-slate-700/80 transition"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-cyan-500" size={20} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:bg-slate-700/80 transition"
              />
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-400">
            <input type="checkbox" className="mr-2 w-4 h-4 rounded" />
            I agree to the{' '}
            <button
              type="button"
              className="text-cyan-400 hover:text-cyan-300 ml-1"
            >
              Terms & Conditions
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <button
            onClick={() => onSwitch && onSwitch('login')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
