import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiUsers, FiCheck, FiX, FiCalendar, FiStar, FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DetailSkeleton } from '../components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tourPackage, setTourPackage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Accordion active day tracking
  const [expandedDay, setExpandedDay] = useState(1);

  // Booking Card Inputs
  const [selectedDate, setSelectedDate] = useState('');
  const [travelersCount, setTravelersCount] = useState(1);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res = await api.get(`/packages/${id}`);
        setTourPackage(res.data.package);
        setReviews(res.data.reviews);
        if (res.data.package.availableDates?.length > 0) {
          setSelectedDate(new Date(res.data.package.availableDates[0]).toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackageDetails();
  }, [id]);

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleBookingRedirect = () => {
    if (!user) {
      navigate(`/login?redirect=/packages/${id}`);
      return;
    }
    navigate(`/booking?packageId=${id}&date=${selectedDate}&travelers=${travelersCount}`);
  };

  if (loading) return <div className="min-h-screen pt-32 pb-16 max-w-7xl mx-auto px-6"><DetailSkeleton /></div>;
  if (!tourPackage) return <div className="min-h-screen pt-32 text-center"><p className="text-gray-500 font-semibold font-display">Package not found.</p></div>;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Back Link */}
        <div className="mb-8 text-left">
          <Link to="/packages" className="inline-flex items-center gap-2 text-xs font-black text-primary/60 hover:text-secondary uppercase tracking-widest transition-colors duration-200">
            <FiArrowLeft className="text-sm" /> Back to Packages
          </Link>
        </div>

        {/* 1. MEDIA CAROUSEL HEADER */}
        <div className="relative rounded-[28px] overflow-hidden mb-16 shadow-luxury border border-primary/5">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="h-[380px] md:h-[500px]"
          >
            {tourPackage.gallery?.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`Tour Gallery ${idx}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 2. MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 text-left">
          
          {/* LEFT: DETAILS AND ACCORDION */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            {/* Title & Metadata */}
            <div className="flex flex-col gap-4 border-b border-primary/5 pb-8">
              <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display flex items-center gap-1.5">
                <FiMapPin className="text-[13px]" /> {tourPackage.destination?.name}, {tourPackage.destination?.country}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight font-display leading-[1.15]">
                {tourPackage.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mt-4 text-[13px] text-primary/65 font-bold">
                <span className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-primary/5 shadow-sm">
                  <FiClock className="text-secondary text-base shrink-0" /> 
                  <span>{tourPackage.duration}</span>
                </span>
                <span className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-primary/5 shadow-sm">
                  <FiUsers className="text-secondary text-base shrink-0" /> 
                  <span>Max Group Size: {tourPackage.maxGroupSize} People</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-full border border-primary/5 shadow-sm text-primary font-bold">
                  <FiStar className="fill-current text-secondary text-base" /> 
                  <span>{tourPackage.ratings} ({tourPackage.numReviews} Reviews)</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-primary font-display">Tour Details</h2>
              <p className="text-[14.5px] leading-relaxed text-primary/65 font-light">
                {tourPackage.description}
              </p>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-10 rounded-[24px] border border-primary/5 shadow-luxury">
              {/* Inclusions */}
              <div className="flex flex-col gap-5">
                <h3 className="font-bold text-primary text-base font-display flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><FiCheck /></span> 
                  <span>What is Included</span>
                </h3>
                <ul className="flex flex-col gap-3 text-xs text-primary/60 font-semibold">
                  {tourPackage.inclusions?.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <FiCheck className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Exclusions */}
              <div className="flex flex-col gap-5 border-t md:border-t-0 md:border-l border-primary/5 pt-8 md:pt-0 md:pl-10">
                <h3 className="font-bold text-primary text-base font-display flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500"><FiX /></span> 
                  <span>What is Excluded</span>
                </h3>
                <ul className="flex flex-col gap-3 text-xs text-primary/60 font-semibold">
                  {tourPackage.exclusions?.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <FiX className="text-rose-500 text-sm mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Daily Itinerary Timeline */}
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-primary font-display mb-1">Detailed Itinerary</h2>
              <div className="flex flex-col gap-4">
                {tourPackage.itinerary?.map((day) => (
                  <div
                    key={day.day}
                    className="bg-white border border-primary/5 rounded-[18px] overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggleDay(day.day)}
                      className="w-full px-6 py-4.5 flex justify-between items-center hover:bg-gray-50/50 transition-colors focus:outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="bg-primary text-secondary text-xs font-black w-14 h-9 rounded-xl flex items-center justify-center shrink-0 font-display">
                          Day {day.day}
                        </span>
                        <span className="font-bold text-sm text-primary text-left line-clamp-1 font-display">{day.title}</span>
                      </div>
                      {expandedDay === day.day ? <FiChevronUp className="text-primary/40 text-lg" /> : <FiChevronDown className="text-primary/40 text-lg" />}
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {expandedDay === day.day && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-primary/5 bg-warm-white/30"
                        >
                          <div className="px-8 py-6 text-left text-xs leading-relaxed text-primary/60 font-medium font-sans">
                            {day.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="flex flex-col gap-6 mt-4">
              <h2 className="text-xl font-bold text-primary font-display border-b border-primary/5 pb-4">
                Guest Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-primary/45 font-medium leading-relaxed italic">No reviews yet for this package. Be the first to share your experience after booking!</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="bg-white p-8 rounded-[20px] border border-primary/5 shadow-luxury flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-full bg-primary/5 flex items-center justify-center text-secondary font-black text-sm font-display border border-primary/5 shadow-inner">
                            {rev.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-primary font-display">{rev.user?.name}</h4>
                            <span className="text-[10px] text-primary/40 font-bold uppercase tracking-wider">Verified Traveler</span>
                          </div>
                        </div>
                        <div className="flex text-secondary gap-0.5 text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <FiStar key={i} className="fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-primary/65 leading-relaxed font-light font-sans pl-1 italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: STICKY CHECKOUT CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-8 md:p-10 rounded-[28px] border border-primary/5 shadow-luxury flex flex-col gap-6">
              <div className="pb-5 border-b border-primary/5 text-left">
                <span className="text-[10px] text-primary/40 font-black uppercase tracking-wider block mb-1">Price Per Person</span>
                <span className="text-3xl font-black text-primary font-display">₹{tourPackage.price.toLocaleString('en-IN')} <span className="text-xs text-primary/40 font-semibold font-sans">INR</span></span>
              </div>

              {/* Date Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
                  <FiCalendar className="text-secondary" /> Departure Date
                </label>
                <div className="bg-gray-50 border border-primary/5 rounded-xl px-2 py-1.5">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs text-primary font-semibold w-full py-1.5 cursor-pointer focus:ring-0"
                  >
                    {tourPackage.availableDates?.map((date, idx) => {
                      const formatted = new Date(date).toISOString().split('T')[0];
                      return (
                        <option key={idx} value={formatted}>
                          {new Date(date).toLocaleDateString()}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Travelers Counter */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
                  <FiUsers className="text-secondary" /> Number of Travelers
                </label>
                <div className="flex items-center justify-between border border-primary/5 rounded-xl p-2.5 bg-gray-50/50">
                  <button
                    onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                    className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-black shadow-sm border border-primary/5 hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-sm text-primary font-display">{travelersCount}</span>
                  <button
                    onClick={() => setTravelersCount(Math.min(tourPackage.maxGroupSize, travelersCount + 1))}
                    className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-black shadow-sm border border-primary/5 hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-primary/5 p-5 rounded-2xl flex justify-between items-center text-xs font-bold mt-2">
                <span className="text-primary/60 font-semibold uppercase tracking-wider">Estimated Total</span>
                <span className="text-xl text-primary font-black font-display">₹{(tourPackage.price * travelersCount).toLocaleString('en-IN')}</span>
              </div>

              {/* Book button */}
              <button
                onClick={handleBookingRedirect}
                className="w-full bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg mt-2 font-display cursor-pointer"
              >
                Proceed to Checkout
              </button>
              
              <span className="text-[10px] text-center text-primary/40 font-semibold leading-relaxed px-1">
                Confirm departures, custom names, and simulated card billing in the next step.
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
