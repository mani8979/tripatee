import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiUsers, FiCheck, FiX, FiCalendar, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
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

  if (loading) return <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-6"><DetailSkeleton /></div>;
  if (!tourPackage) return <div className="min-h-screen pt-28 text-center"><p className="text-gray-500">Package not found.</p></div>;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. MEDIA CAROUSEL HEADER */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-md">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="h-[380px] md:h-[480px]"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
          
          {/* LEFT: DETAILS AND ACCORDION */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Title & Metadata */}
            <div className="flex flex-col gap-4">
              <span className="text-secondary text-sm font-extrabold uppercase tracking-wider flex items-center gap-1">
                <FiMapPin /> {tourPackage.destination?.name}, {tourPackage.destination?.country}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {tourPackage.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mt-2 text-sm text-gray-600 font-medium">
                <span className="flex items-center gap-1.5"><FiClock className="text-primary text-lg" /> {tourPackage.duration}</span>
                <span className="flex items-center gap-1.5"><FiUsers className="text-primary text-lg" /> Max Group Size: {tourPackage.maxGroupSize} People</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <FiStar className="fill-current text-lg mt-[-3px]" /> {tourPackage.ratings} ({tourPackage.numReviews} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-gray-900">Tour Description</h2>
              <p className="text-sm leading-relaxed text-gray-500 font-normal">
                {tourPackage.description}
              </p>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              {/* Inclusions */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><FiCheck /></span> Inclusions
                </h3>
                <ul className="flex flex-col gap-2.5 text-xs text-gray-500 font-medium">
                  {tourPackage.inclusions?.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FiCheck className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Exclusions */}
              <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-500"><FiX /></span> Exclusions
                </h3>
                <ul className="flex flex-col gap-2.5 text-xs text-gray-500 font-medium">
                  {tourPackage.exclusions?.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FiX className="text-rose-500 text-sm mt-0.5 shrink-0" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Daily Itinerary Timeline */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Detailed Itinerary</h2>
              <div className="flex flex-col gap-3">
                {tourPackage.itinerary?.map((day) => (
                  <div
                    key={day.day}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggleDay(day.day)}
                      className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <span className="bg-primary text-white text-xs font-extrabold w-12 h-8 rounded-lg flex items-center justify-center shrink-0">
                          Day {day.day}
                        </span>
                        <span className="font-bold text-sm text-gray-800 text-left line-clamp-1">{day.title}</span>
                      </div>
                      {expandedDay === day.day ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {expandedDay === day.day && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-gray-50 bg-gray-50/20"
                        >
                          <div className="px-6 py-5 text-left text-xs leading-relaxed text-gray-500">
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
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                Guest Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400">No reviews yet for this package. Be the first to share your experience after booking!</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {rev.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{rev.user?.name}</h4>
                            <span className="text-[10px] text-gray-400 font-medium">Verified Traveler</span>
                          </div>
                        </div>
                        <div className="flex text-amber-400 gap-0.5 text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <FiStar key={i} className="fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
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
            <div className="sticky top-28 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex flex-col gap-6">
              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Price Per Person</span>
                <span className="text-3xl font-extrabold text-primary">₹{tourPackage.price} <span className="text-xs text-gray-400 font-normal">INR</span></span>
              </div>

              {/* Date Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <FiCalendar className="text-primary" /> Select Departure Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs text-gray-700 font-medium w-full focus:outline-none"
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

              {/* Travelers Counter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <FiUsers className="text-primary" /> Number of Travelers
                </label>
                <div className="flex items-center justify-between border border-gray-200 rounded-xl p-2 bg-gray-50">
                  <button
                    onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                    className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-bold shadow hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-sm">{travelersCount}</span>
                  <button
                    onClick={() => setTravelersCount(Math.min(tourPackage.maxGroupSize, travelersCount + 1))}
                    className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-bold shadow hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-primary/5 p-4 rounded-2xl flex justify-between items-center text-sm font-bold mt-2">
                <span className="text-gray-600 font-medium">Estimated Total:</span>
                <span className="text-lg text-primary font-extrabold">₹{tourPackage.price * travelersCount}</span>
              </div>

              {/* Book button */}
              <button
                onClick={handleBookingRedirect}
                className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 mt-2"
              >
                Proceed to Checkout
              </button>
              
              <span className="text-[10px] text-center text-gray-400 font-semibold leading-relaxed">
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
