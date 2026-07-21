import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiInfo } from 'react-icons/fi';
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
    <div className="min-h-screen flex items-center justify-center bg-warm-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative Blur BG elements */}
      <div className="absolute w-80 h-80 bg-secondary/5 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-80 h-80 bg-primary/5 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="w-full max-w-md bg-white border border-primary/5 p-10 rounded-[28px] shadow-luxury text-left relative z-10">
        <div className="text-center mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-primary font-display tracking-tight">Verify Email</h2>
          <p className="text-xs text-primary/50 font-bold uppercase tracking-wider">Input the 6-digit code dispatched to your mailbox</p>
          <span className="text-[10px] text-primary/65 font-bold mt-2 break-all bg-gray-50 py-2 px-4 rounded-xl border border-primary/5 flex items-center justify-center gap-2">
            <FiMail className="text-secondary" /> {email}
          </span>
        </div>

        {authError && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold mb-6 leading-relaxed">
            {authError}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-semibold mb-6 leading-relaxed">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Verification OTP Code</label>
            <input
              type="text"
              maxLength="6"
              required
              placeholder="e.g. 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="px-4 py-3.5 bg-gray-50 border border-primary/5 rounded-xl text-center font-bold tracking-[10px] text-lg text-primary focus:outline-none focus:border-secondary focus:bg-white transition-all w-full placeholder-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 font-display cursor-pointer"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="flex justify-between items-center text-xs mt-8 border-t border-primary/5 pt-6">
          <span className="text-primary/55 font-semibold">Didn't receive a code?</span>
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-secondary hover:text-primary font-black transition-colors cursor-pointer"
          >
            Resend Code
          </button>
        </div>

        {/* Local testing tip */}
        <div className="mt-8 p-4 bg-primary/5 rounded-xl text-[10.5px] text-primary/60 leading-relaxed font-semibold flex gap-2">
          <FiInfo className="text-secondary text-base shrink-0 mt-0.5" />
          <span>
            <strong className="text-primary font-bold">Local Dev Tip:</strong> Check the server terminal logs to see the printed simulation email body containing your OTP!
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
