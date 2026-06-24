import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup, authError } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signup(name, email, password);
    setLoading(false);

    if (res.success) {
      if (res.isVerified) {
        // Automatically logged in (usually first admin user is auto-verified)
        navigate(redirectUrl);
      } else {
        // Normal user must verify OTP
        navigate(`/verify-otp?email=${res.email}&redirect=${redirectUrl}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 pt-28 pb-16 px-6 relative overflow-hidden">
      {/* Decorative Blur BG elements */}
      <div className="absolute w-72 h-72 bg-primary/5 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-72 h-72 bg-secondary/5 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl text-left relative z-10">
        <div className="text-center mb-8 flex flex-col gap-1.5">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-xs text-gray-400 font-medium">Join Tripatee to start booking luxury tours</p>
        </div>

        {authError && (
          <div className="p-3.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold mb-6">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary focus-within:bg-white transition-all">
              <FiUser className="text-gray-400 text-sm" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-gray-700 font-medium"
              />
            </div>
          </div>

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
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Password</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary focus-within:bg-white transition-all">
              <FiLock className="text-gray-400 text-sm" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
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
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
