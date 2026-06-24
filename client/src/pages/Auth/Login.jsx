import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, authError } = useAuth();
  
  const [successMsg, setSuccessMsg] = useState('');
  const redirectUrl = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (searchParams.get('expired')) {
      setSuccessMsg('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(redirectUrl);
    } else if (res.notVerified) {
      // Redirect to OTP verification screen if email registered but unverified
      navigate(`/verify-otp?email=${res.email}&redirect=${redirectUrl}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 pt-28 pb-16 px-6 relative overflow-hidden">
      {/* Decorative Blur BG elements */}
      <div className="absolute w-72 h-72 bg-primary/5 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-72 h-72 bg-secondary/5 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl text-left relative z-10">
        <div className="text-center mb-8 flex flex-col gap-1.5">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-400 font-medium">Log in to manage your luxury tour packages</p>
        </div>

        {authError && (
          <div className="p-3.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold mb-6">
            {authError}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-primary/5 text-primary rounded-xl text-xs font-semibold mb-6 flex gap-2">
            <FiInfo className="text-lg shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary focus-within:bg-white transition-all">
              <FiMail className="text-gray-400 text-sm" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              <span>Password</span>
              <Link to="/forgot-password" className="text-primary hover:underline lowercase font-semibold tracking-normal">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary focus-within:bg-white transition-all">
              <FiLock className="text-gray-400 text-sm" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-gray-700 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/10 disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Demo credentials tip */}
        <div className="mt-8 border-t border-gray-50 pt-5 text-[10px] text-gray-400 leading-relaxed font-semibold">
          <p className="text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-1">Demo Credentials:</p>
          <p>Admin: <span className="text-gray-600">admin@tripatee.com</span> / <span className="text-gray-600">password123</span></p>
          <p>User: <span className="text-gray-600">user@tripatee.com</span> / <span className="text-gray-600">password123</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
