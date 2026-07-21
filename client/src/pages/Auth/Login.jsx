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
    <div className="min-h-screen flex items-center justify-center bg-warm-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative Blur BG elements */}
      <div className="absolute w-80 h-80 bg-secondary/5 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-80 h-80 bg-primary/5 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="w-full max-w-md bg-white border border-primary/5 p-10 rounded-[28px] shadow-luxury text-left relative z-10">
        <div className="text-center mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-primary font-display tracking-tight">Welcome Back</h2>
          <p className="text-xs text-primary/50 font-bold uppercase tracking-wider">Log in to manage your luxury experiences</p>
        </div>

        {authError && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold mb-6 leading-relaxed">
            {authError}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-primary/5 border border-primary/5 text-primary rounded-xl text-xs font-semibold mb-6 flex gap-2.5 leading-relaxed">
            <FiInfo className="text-base text-secondary shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Email Address</label>
            <div className="flex items-center gap-2.5 bg-gray-50 border border-primary/5 rounded-xl px-4 py-3 focus-within:border-secondary focus-within:bg-white transition-all">
              <FiMail className="text-secondary text-sm shrink-0" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-primary font-semibold placeholder-primary/30"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">
              <span>Password</span>
              <Link to="/forgot-password" className="text-secondary hover:text-primary transition-colors tracking-normal normal-case font-bold">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-2.5 bg-gray-50 border border-primary/5 rounded-xl px-4 py-3 focus-within:border-secondary focus-within:bg-white transition-all">
              <FiLock className="text-secondary text-sm shrink-0" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-primary font-semibold placeholder-primary/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 mt-2 font-display cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-xs text-primary/55 font-semibold mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-secondary hover:text-primary font-black transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
