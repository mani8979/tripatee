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
    <div className="min-h-screen flex items-center justify-center bg-warm-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative Blur BG elements */}
      <div className="absolute w-80 h-80 bg-secondary/5 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-80 h-80 bg-primary/5 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="w-full max-w-md bg-white border border-primary/5 p-10 rounded-[28px] shadow-luxury text-left relative z-10">
        <div className="text-center mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-primary font-display tracking-tight">Create Account</h2>
          <p className="text-xs text-primary/50 font-bold uppercase tracking-wider">Join Flashmob Travels for luxury explorations</p>
        </div>

        {authError && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold mb-6 leading-relaxed">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Full Name</label>
            <div className="flex items-center gap-2.5 bg-gray-50 border border-primary/5 rounded-xl px-4 py-3 focus-within:border-secondary focus-within:bg-white transition-all">
              <FiUser className="text-secondary text-sm shrink-0" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-primary font-semibold placeholder-primary/30"
              />
            </div>
          </div>

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
            <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Password</label>
            <div className="flex items-center gap-2.5 bg-gray-50 border border-primary/5 rounded-xl px-4 py-3 focus-within:border-secondary focus-within:bg-white transition-all">
              <FiLock className="text-secondary text-sm shrink-0" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
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
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-primary/55 font-semibold mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary hover:text-primary font-black transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
