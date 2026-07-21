import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import api from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Request Code, 2 = Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Send recovery OTP
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccessMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Email does not exist in our systems.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset using OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/auth/reset-password', { email, otp, password: newPassword });
      navigate('/login?expired=true'); // Redirect to login with success trigger
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative Blur BG elements */}
      <div className="absolute w-80 h-80 bg-secondary/5 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-80 h-80 bg-primary/5 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="w-full max-w-md bg-white border border-primary/5 p-10 rounded-[28px] shadow-luxury text-left relative z-10">
        <div className="text-center mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-primary font-display tracking-tight">Recover Password</h2>
          <p className="text-xs text-primary/50 font-bold uppercase tracking-wider">Reset your credentials using email verification</p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold mb-6 leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-semibold mb-6 leading-relaxed">
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="flex flex-col gap-5">
            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Registered Email Address</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 mt-2 font-display cursor-pointer"
            >
              {loading ? 'Sending code...' : 'Send Recovery Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
            {/* OTP code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">6-Digit Recovery OTP</label>
              <div className="flex items-center gap-2.5 bg-gray-50 border border-primary/5 rounded-xl px-4 py-3 focus-within:border-secondary focus-within:bg-white transition-all">
                <FiShield className="text-secondary text-sm shrink-0" />
                <input
                  type="text"
                  maxLength="6"
                  required
                  placeholder="e.g. 123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="bg-transparent border-none outline-none text-xs w-full text-primary font-semibold placeholder-primary/30"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">New Password</label>
              <div className="flex items-center gap-2.5 bg-gray-50 border border-primary/5 rounded-xl px-4 py-3 focus-within:border-secondary focus-within:bg-white transition-all">
                <FiLock className="text-secondary text-sm shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-primary font-semibold placeholder-primary/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-amber-400 hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 mt-2 font-display cursor-pointer"
            >
              {loading ? 'Resetting password...' : 'Complete Password Reset'}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-primary/55 font-semibold mt-8">
          <Link to="/login" className="text-secondary hover:text-primary transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
