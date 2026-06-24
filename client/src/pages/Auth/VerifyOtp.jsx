import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp, authError } = useAuth();

  const email = searchParams.get('email') || '';
  const redirectUrl = searchParams.get('redirect') || '/';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    setSuccessMsg('');
    const res = await verifyOtp(email, otp);
    setLoading(false);

    if (res.success) {
      navigate(redirectUrl);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setSuccessMsg('');
    const res = await resendOtp(email);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('A new 6-digit verification code has been dispatched!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 pt-28 pb-16 px-6 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-primary/5 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-72 h-72 bg-secondary/5 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl text-left relative z-10">
        <div className="text-center mb-8 flex flex-col gap-1.5">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Verify Email</h2>
          <p className="text-xs text-gray-400 font-medium">Input the 6-digit code dispatched to your mailbox</p>
          <span className="text-[10px] text-gray-500 font-bold mt-1 break-all bg-gray-50 py-1.5 px-3 rounded-lg border border-gray-100 flex items-center justify-center gap-1.5">
            <FiMail /> {email}
          </span>
        </div>

        {authError && (
          <div className="p-3.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold mb-6">
            {authError}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold mb-6">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Verification OTP Code</label>
            <input
              type="text"
              maxLength="6"
              required
              placeholder="e.g. 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold tracking-[10px] text-lg text-primary focus:outline-none focus:border-primary focus:bg-white transition-all w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/10 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="flex justify-between items-center text-xs mt-6 border-t border-gray-50 pt-5">
          <span className="text-gray-400 font-medium">Didn't receive a code?</span>
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-primary font-bold hover:underline disabled:opacity-50 cursor-pointer"
          >
            Resend Code
          </button>
        </div>

        {/* Local testing tip */}
        <div className="mt-6 p-3 bg-primary/5 rounded-xl text-[10px] text-gray-400 leading-relaxed font-semibold">
          <span className="text-primary font-bold">Local Dev Tip:</span> Check the server terminal logs to see the printed simulation email body containing your OTP!
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
