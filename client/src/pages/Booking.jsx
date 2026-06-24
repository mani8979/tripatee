import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiUsers, FiCreditCard, FiCheckCircle, FiInfo } from 'react-icons/fi';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* PROGRESS INDICATOR BAR */}
        <div className="flex items-center justify-between mb-10 max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow transition-all ${
              step >= 1 ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-400'
            }`}>
              1
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Guests</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 transition-all ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>

          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow transition-all ${
              step >= 2 ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-400'
            }`}>
              2
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Payment</span>
          </div>

          <div className={`flex-1 h-0.5 mx-4 transition-all ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>

          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow transition-all ${
              step === 3 ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-400'
            }`}>
              3
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step === 3 ? 'text-primary' : 'text-gray-400'}`}>Confirm</span>
          </div>
        </div>

        {/* STEP PANELS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          {/* Main Checkout Panel (Steps 1 & 2) */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-left">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: TRAVELERS DETAILS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                    <FiUsers className="text-primary" /> Guest Details
                  </h2>

                  <form onSubmit={handleSubmit(handleTravelersSubmit)} className="flex flex-col gap-6">
                    {fields.map((field, idx) => (
                      <div key={field.id} className="p-5 border border-gray-100 rounded-2xl flex flex-col gap-4 bg-gray-50/30">
                        <span className="text-xs font-bold text-primary">Traveler #{idx + 1}</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Name */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                            <input
                              type="text"
                              required
                              placeholder="Name as on Passport"
                              {...register(`travelers.${idx}.name`, { required: true })}
                              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary"
                            />
                          </div>

                          {/* Age */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Age</label>
                            <input
                              type="number"
                              required
                              placeholder="Age"
                              {...register(`travelers.${idx}.age`, { required: true, min: 1 })}
                              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Gender</label>
                          <div className="flex gap-4">
                            {['Male', 'Female', 'Other'].map((g) => (
                              <label key={g} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                                <input
                                  type="radio"
                                  value={g}
                                  {...register(`travelers.${idx}.gender`)}
                                  className="accent-primary"
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
                      className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-4 rounded-xl transition-all shadow-md shadow-primary/10 disabled:opacity-50"
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
                  <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                    <FiCreditCard className="text-primary" /> Simulated Billing
                  </h2>

                  <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-6">
                    <div className="p-4 bg-primary/5 rounded-2xl flex gap-3 text-xs text-primary leading-relaxed">
                      <FiInfo className="text-lg shrink-0 mt-0.5" />
                      <span>This is a simulated booking interface. You can input any mock credit card details to complete your test checkout.</span>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Card Holder */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Name on Card</label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                        />
                      </div>

                      {/* Card Number */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Card Number</label>
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 1234 5678"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Expiry */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Expiry Date</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                          />
                        </div>

                        {/* CVV */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength="3"
                            required
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {errorMsg && <p className="text-xs text-red-500 font-bold">{errorMsg}</p>}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-6 py-4 rounded-xl transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold py-4 rounded-xl transition-all shadow-md shadow-secondary/10 disabled:opacity-50"
                      >
                        {submitting ? 'Authorizing Payment...' : `Authorize Charge ₹${tourPackage.price * travelersCount}`}
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
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Booking Confirmed!</h2>
                  <p className="text-sm text-gray-500 max-w-sm mt-2 mb-8 leading-relaxed">
                    Thank you! Your payment was charged successfully and your tour tickets have been registered in our system.
                  </p>

                  <div className="w-full border-t border-b border-gray-100 py-6 mb-8 flex flex-col gap-3.5 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Transaction ID:</span>
                      <span className="font-extrabold text-gray-900">{paymentResponse?.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Tour Package:</span>
                      <span className="font-bold text-gray-900">{tourPackage.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Departure Date:</span>
                      <span className="font-bold text-gray-900">{new Date(departureDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Guests Count:</span>
                      <span className="font-bold text-gray-900">{travelersCount} Travelers</span>
                    </div>
                    <div className="flex justify-between pt-2.5 border-t border-gray-50">
                      <span className="text-gray-400 font-medium">Total Price:</span>
                      <span className="text-base text-primary font-extrabold">₹{tourPackage.price * travelersCount} INR</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-4 rounded-xl transition-all shadow-md shadow-primary/10"
                  >
                    Go to Booking History
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Checkout Right Side: Booking Summary */}
          {step < 3 && (
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 text-left">
              <h3 className="font-extrabold text-gray-900 text-sm border-b border-gray-50 pb-3">Booking Summary</h3>
              
              <div className="flex items-center gap-3">
                <img
                  src={tourPackage.gallery?.[0]}
                  alt="Tour"
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{tourPackage.title}</h4>
                  <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-1">
                    <FiMapPin /> {tourPackage.destination?.name}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-4 flex flex-col gap-2.5 text-[11px] text-gray-500 font-medium">
                <div className="flex justify-between">
                  <span>Departure Date:</span>
                  <span className="text-gray-800 font-bold">{new Date(departureDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Per Guest:</span>
                  <span className="text-gray-800 font-bold">₹{tourPackage.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="text-gray-800 font-bold">{travelersCount}</span>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-4 flex justify-between items-center text-xs font-bold text-gray-800">
                <span>Grand Total:</span>
                <span className="text-base text-primary font-extrabold">₹{tourPackage.price * travelersCount}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Booking;
