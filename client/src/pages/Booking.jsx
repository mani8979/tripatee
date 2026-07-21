import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiUsers, FiCreditCard, FiCheckCircle, FiInfo, FiMapPin } from 'react-icons/fi';
import api from '../services/api';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const packageId = searchParams.get('packageId');
  const departureDate = searchParams.get('date');
  const travelersCount = Number(searchParams.get('travelers') || 1);

  const [tourPackage, setTourPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Checkout flow state: 1 = Travelers Info, 2 = Payment, 3 = Confirmation
  const [step, setStep] = useState(1);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forms setup
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      travelers: Array.from({ length: travelersCount }).map(() => ({ name: '', age: '', gender: 'Male' }))
    }
  });

  const { fields } = useFieldArray({
    control,
    name: 'travelers',
  });

  // Credit Card Form states
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (!packageId) {
      navigate('/packages');
      return;
    }

    const fetchPackage = async () => {
      try {
        const res = await api.get(`/packages/${packageId}`);
        setTourPackage(res.data.package);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId]);

  // Submit Travelers info & Proceed to payment step
  const handleTravelersSubmit = async (data) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      // Create the booking entry first (status: pending, paymentStatus: pending)
      const res = await api.post('/bookings', {
        packageId,
        travelersCount,
        travelersDetails: data.travelers,
        bookingDate: departureDate,
      });
      setBookingResponse(res.data.booking);
      setStep(2); // Advance to payment
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to register booking. Please verify details.');
    } finally {
      setSubmitting(false);
    }
  };

  // Process Mock Card payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      setErrorMsg('Please fill in all payment details');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      // Charge payment
      const res = await api.post('/payments/charge', {
        bookingId: bookingResponse._id,
        paymentMethod: 'Credit Card (Simulated)',
      });
      setPaymentResponse(res.data.payment);
      setStep(3); // Advance to receipt confirmation
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment simulation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tourPackage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-warm-white px-6 text-center">
        <h2 className="text-xl font-bold text-primary font-display mb-2">Package Not Found</h2>
        <p className="text-xs text-primary/50 mb-6 max-w-sm font-light">The package you are trying to book could not be found or does not exist.</p>
        <button onClick={() => navigate('/packages')} className="bg-primary hover:bg-secondary hover:text-primary text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm font-display cursor-pointer">
          Browse All Packages
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        
        {/* PROGRESS INDICATOR BAR */}
        <div className="flex items-center justify-between mb-16 max-w-md mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all font-display ${
              step >= 1 ? 'bg-primary text-secondary border border-secondary/20' : 'bg-white border border-primary/5 text-primary/40'
            }`}>
              1
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest font-display ${step >= 1 ? 'text-primary' : 'text-primary/40'}`}>Guests</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 transition-all ${step >= 2 ? 'bg-primary' : 'bg-primary/5'}`}></div>

          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all font-display ${
              step >= 2 ? 'bg-primary text-secondary border border-secondary/20' : 'bg-white border border-primary/5 text-primary/40'
            }`}>
              2
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest font-display ${step >= 2 ? 'text-primary' : 'text-primary/40'}`}>Payment</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 transition-all ${step >= 3 ? 'bg-primary' : 'bg-primary/5'}`}></div>

          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all font-display ${
              step === 3 ? 'bg-primary text-secondary border border-secondary/20' : 'bg-white border border-primary/5 text-primary/40'
            }`}>
              3
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest font-display ${step === 3 ? 'text-primary' : 'text-primary/40'}`}>Confirm</span>
          </div>
        </div>

        {/* STEP PANELS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          {/* Main Checkout Panel (Steps 1 & 2) */}
          <div className="md:col-span-2 bg-white p-8 md:p-10 rounded-[28px] border border-primary/5 shadow-luxury text-left">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: TRAVELERS DETAILS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <h2 className="text-xl font-bold text-primary font-display mb-6 border-b border-primary/5 pb-3 flex items-center gap-2">
                    <FiUsers className="text-secondary" /> Guest Details
                  </h2>

                  <form onSubmit={handleSubmit(handleTravelersSubmit)} className="flex flex-col gap-6">
                    {fields.map((field, idx) => (
                      <div key={field.id} className="p-6 border border-primary/5 rounded-[18px] flex flex-col gap-4 bg-gray-50/30">
                        <span className="text-xs font-bold text-primary pl-0.5">Traveler #{idx + 1}</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-primary">
                          {/* Name */}
                          <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Full Name</label>
                            <input
                              type="text"
                              required
                              placeholder="Name as on Passport"
                              {...register(`travelers.${idx}.name`, { required: true })}
                              className="px-4 py-3 bg-white border border-primary/5 rounded-xl text-xs font-semibold focus:outline-none focus:border-secondary transition-all"
                            />
                          </div>

                          {/* Age */}
                          <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Age</label>
                            <input
                              type="number"
                              required
                              placeholder="Age"
                              {...register(`travelers.${idx}.age`, { required: true, min: 1 })}
                              className="px-4 py-3 bg-white border border-primary/5 rounded-xl text-xs font-semibold focus:outline-none focus:border-secondary transition-all"
                            />
                          </div>
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-2.5 text-left mt-1.5">
                          <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Gender</label>
                          <div className="flex gap-6">
                            {['Male', 'Female', 'Other'].map((g) => (
                              <label key={g} className="flex items-center gap-2 text-xs font-bold text-primary/75 cursor-pointer">
                                <input
                                  type="radio"
                                  value={g}
                                  {...register(`travelers.${idx}.gender`)}
                                  className="accent-secondary w-4.5 h-4.5"
                                />
                                {g}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {errorMsg && <p className="text-xs text-red-500 font-bold">{errorMsg}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 mt-2 font-display cursor-pointer"
                    >
                      {submitting ? 'Creating Order...' : 'Continue to Payment'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: SIMULATED CREDIT CARD PAYMENT */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <h2 className="text-xl font-bold text-primary font-display mb-6 border-b border-primary/5 pb-3 flex items-center gap-2">
                    <FiCreditCard className="text-secondary" /> Simulated Billing
                  </h2>

                  <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-6">
                    <div className="p-4 bg-primary/5 border border-primary/5 rounded-2xl flex gap-3 text-xs text-primary leading-relaxed">
                      <FiInfo className="text-lg text-secondary shrink-0 mt-0.5" />
                      <span>This is a simulated booking interface. You can input any mock credit card details to complete your test checkout.</span>
                    </div>

                    <div className="flex flex-col gap-4 text-xs font-semibold text-primary">
                      {/* Card Holder */}
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Name on Card</label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold focus:outline-none focus:border-secondary focus:bg-white transition-all"
                        />
                      </div>

                      {/* Card Number */}
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Card Number</label>
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 1234 5678"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold focus:outline-none focus:border-secondary focus:bg-white transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Expiry */}
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Expiry Date</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold focus:outline-none focus:border-secondary focus:bg-white transition-all"
                          />
                        </div>

                        {/* CVV */}
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength="3"
                            required
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold focus:outline-none focus:border-secondary focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {errorMsg && <p className="text-xs text-red-500 font-bold">{errorMsg}</p>}

                    <div className="flex gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="bg-gray-100 hover:bg-gray-200 text-primary font-black text-xs uppercase tracking-wider px-6 py-4.5 rounded-xl transition-all cursor-pointer font-display"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-secondary hover:bg-amber-400 hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 font-display cursor-pointer"
                      >
                        {submitting ? 'Authorizing Payment...' : `Authorize Charge ₹${(tourPackage.price * travelersCount).toLocaleString('en-IN')}`}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: TRANSACTION SUCCESS CONFIRMATION */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <FiCheckCircle className="text-6xl text-secondary mb-4 animate-bounce" />
                  <h2 className="text-2xl font-black text-primary font-display tracking-tight mt-2">Booking Confirmed!</h2>
                  <p className="text-sm text-primary/60 max-w-sm mt-3 mb-8 leading-relaxed font-light">
                    Thank you! Your payment was charged successfully and your tour tickets have been registered in our system.
                  </p>

                  <div className="w-full border-t border-b border-primary/5 py-6 mb-8 flex flex-col gap-3.5 text-xs text-primary/75">
                    <div className="flex justify-between">
                      <span className="text-primary/45 font-black uppercase tracking-wider">Transaction ID:</span>
                      <span className="font-extrabold text-primary font-display">{paymentResponse?.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/45 font-black uppercase tracking-wider">Tour Package:</span>
                      <span className="font-extrabold text-primary">{tourPackage.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/45 font-black uppercase tracking-wider">Departure Date:</span>
                      <span className="font-extrabold text-primary">{new Date(departureDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/45 font-black uppercase tracking-wider">Guests Count:</span>
                      <span className="font-extrabold text-primary">{travelersCount} Travelers</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-primary/5">
                      <span className="text-primary/45 font-black uppercase tracking-wider">Total Price:</span>
                      <span className="text-base text-primary font-black font-display">₹{(tourPackage.price * travelersCount).toLocaleString('en-IN')} INR</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-display cursor-pointer"
                  >
                    Go to Booking History
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Checkout Right Side: Booking Summary */}
          {step < 3 && (
            <div className="lg:col-span-1 bg-white p-6 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col gap-4 text-left">
              <h3 className="font-extrabold text-primary text-sm border-b border-primary/5 pb-3 font-display">Booking Summary</h3>
              
              <div className="flex items-center gap-3">
                <img
                  src={tourPackage.gallery?.[0]}
                  alt="Tour"
                  className="w-16 h-16 rounded-xl object-cover border border-primary/5"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-primary line-clamp-1 font-display">{tourPackage.title}</h4>
                  <span className="text-[10px] text-primary/45 font-bold flex items-center gap-1 mt-1 uppercase tracking-wide">
                    <FiMapPin className="text-secondary" /> {tourPackage.destination?.name}
                  </span>
                </div>
              </div>

              <div className="border-t border-primary/5 pt-4 flex flex-col gap-2.5 text-[11px] text-primary/55 font-bold uppercase tracking-wider font-display">
                <div className="flex justify-between">
                  <span>Departure Date</span>
                  <span className="text-primary font-extrabold normal-case">{new Date(departureDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Per Guest</span>
                  <span className="text-primary font-extrabold normal-case">₹{tourPackage.price?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span className="text-primary font-extrabold normal-case">{travelersCount}</span>
                </div>
              </div>

              <div className="border-t border-primary/5 pt-4 flex justify-between items-center text-xs font-black text-primary font-display uppercase tracking-wider">
                <span>Grand Total</span>
                <span className="text-lg text-primary font-black font-display normal-case">₹{(tourPackage.price * travelersCount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Booking;
