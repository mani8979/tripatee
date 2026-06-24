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
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 pt-28 pb-16 px-6 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-primary/5 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-72 h-72 bg-secondary/5 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl text-left relative z-10">
        <div className="text-center mb-8 flex flex-col gap-1.5">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Recover Password</h2>
          <p className="text-xs text-gray-400 font-medium">Reset your credential keys using email verification</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold mb-6">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold mb-6">
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="flex flex-col gap-5">
            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Registered Email Address</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/10 disabled:opacity-50 mt-2"
            >
              {loading ? 'Sending code...' : 'Send Recovery Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
            {/* OTP code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">6-Digit Recovery OTP</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary focus-within:bg-white transition-all">
                <FiShield className="text-gray-400 text-sm" />
                <input
                  type="text"
                  maxLength="6"
                  required
                  placeholder="e.g. 123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-700 font-medium"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">New Password</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary focus-within:bg-white transition-all">
                <FiLock className="text-gray-400 text-sm" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary-hover text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md shadow-secondary/10 disabled:opacity-50 mt-2"
            >
              {loading ? 'Resetting password...' : 'Complete Password Reset'}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-400 font-medium mt-6">
          <Link to="/login" className="text-primary font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
