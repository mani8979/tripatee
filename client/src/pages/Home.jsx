import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiClock, FiStar, FiTrendingUp, FiGlobe, FiAward } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [newsletterErr, setNewsletterErr] = useState('');

  // Search parameters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDest, setSelectedDest] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const navigate = useNavigate();
  const { toggleSaveTrip, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destRes = await api.get('/packages/destinations');
        setDestinations(destRes.data.filter(d => d.popular).slice(0, 4));

        const pkgRes = await api.get('/packages?featured=true&limit=6');
        setFeaturedPackages(pkgRes.data.packages);
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedDest) params.append('destination', selectedDest);
    if (maxBudget) params.append('maxPrice', maxBudget);
    navigate(`/packages?${params.toString()}`);
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterMsg('');
    setNewsletterErr('');
    try {
      const res = await api.post('/newsletter', { email: newsletterEmail });
      setNewsletterMsg(res.data.message);
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterErr(err.response?.data?.message || 'Something went wrong. Please check your email.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-[0.6]"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center gap-6 mt-12">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-secondary text-sm md:text-base font-extrabold uppercase tracking-widest bg-secondary/15 px-4 py-1.5 rounded-full"
          >
            Luxury Travel Crafted for You
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans"
          >
            Escape the Ordinary, <br />
            <span className="text-secondary">Explore the World</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-xl text-gray-200/90 max-w-2xl font-light leading-relaxed"
          >
            Unlock elite collections of hand-picked itineraries, 5-star hotels, and authentic experiences worldwide with Tripatee.
          </motion.p>

          {/* Search Form Panel */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSearch}
            className="w-full max-w-4xl mt-8 glass-card border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center text-gray-900"
          >
            {/* Search Keyword */}
            <div className="w-full flex items-center gap-3 bg-white/90 px-4 py-3.5 rounded-2xl border border-gray-100 shrink-0 md:flex-1">
              <FiSearch className="text-primary text-xl shrink-0" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
              />
            </div>

            {/* Destination Selection */}
            <div className="w-full flex items-center gap-3 bg-white/90 px-4 py-3.5 rounded-2xl border border-gray-100 shrink-0 md:flex-1">
              <FiMapPin className="text-primary text-xl shrink-0" />
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
              >
                <option value="">Any Destination</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div className="w-full flex items-center gap-3 bg-white/90 px-4 py-3.5 rounded-2xl border border-gray-100 shrink-0 md:flex-1">
              <span className="text-primary text-lg font-bold shrink-0 w-5 text-center select-none">₹</span>
              <input
                type="number"
                placeholder="Max Budget (INR)"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-primary/20 shrink-0"
            >
              Search
            </button>
          </motion.form>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white animate-bounce hidden md:block">
          <span className="text-xs tracking-widest uppercase font-semibold text-gray-300">Scroll Down</span>
        </div>
      </div>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col gap-12">
          <div className="flex flex-col items-center gap-2">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Luxury Travel Ecosystems</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
                <FiGlobe />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Elite Destinations</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Handpicked global landscapes verified by luxury travel editors for maximum privacy and prestige.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary text-2xl">
                <FiTrendingUp />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Curated Itineraries</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Uniquely planned routes combining historical tours, food encounters, and high-adrenaline excursions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl">
                <FiAward />
              </div>
              <h3 className="text-lg font-bold text-gray-900">5-Star Services</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Seamless reservations with premium hotel accommodations, private transport guides, and 24/7 concierge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED TOUR PACKAGES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="flex flex-col gap-2">
              <span className="text-primary text-xs font-extrabold uppercase tracking-widest text-left">Elite Collections</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight text-left">Our Featured Packages</h2>
            </div>
            <Link
              to="/packages"
              className="text-primary font-bold text-sm hover:text-primary-hover flex items-center gap-1 transition-colors"
            >
              Browse All Packages →
            </Link>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-16"
            >
              {featuredPackages.map((pkg) => (
                <SwiperSlide key={pkg._id}>
                  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col h-[520px]">
                    {/* Cover image */}
                    <div className="relative h-64 overflow-hidden shrink-0">
                      <img
                        src={pkg.gallery?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop'}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow">
                        {pkg.duration}
                      </div>
                      {/* Save Trip Button */}
                      <button
                        onClick={() => toggleSaveTrip(pkg._id)}
                        className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all bg-white hover:scale-105 ${
                          user?.savedTrips?.some((t) => (t._id || t) === pkg._id)
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <FiStar className="fill-current text-sm" />
                      </button>
                    </div>

                    {/* Content details */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1 text-xs font-semibold text-secondary">
                          <FiMapPin /> {pkg.destination?.name || 'Global'}
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {pkg.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-medium">Starting at</span>
                          <span className="text-2xl font-extrabold text-primary">₹{pkg.price}</span>
                        </div>
                        <Link
                          to={`/packages/${pkg._id}`}
                          className="bg-secondary hover:bg-secondary-hover text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* 4. STATISTICS BANNER */}
      <section className="py-20 bg-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&auto=format&fit=crop"
            alt="Stats background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-extrabold text-secondary">15K+</span>
            <span className="text-xs md:text-sm text-gray-400 font-semibold tracking-wider uppercase">Happy Clients</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-extrabold text-secondary">500+</span>
            <span className="text-xs md:text-sm text-gray-400 font-semibold tracking-wider uppercase">Luxury Tours</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-extrabold text-secondary">120+</span>
            <span className="text-xs md:text-sm text-gray-400 font-semibold tracking-wider uppercase">Destinations</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-extrabold text-secondary">4.9/5</span>
            <span className="text-xs md:text-sm text-gray-400 font-semibold tracking-wider uppercase">Average Rating</span>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Voices of Our Voyagers</h2>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000 }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            <SwiperSlide>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-72 text-left">
                <div className="flex flex-col gap-4">
                  <div className="flex text-amber-400 gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FiStar key={idx} className="fill-current text-sm" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed italic">
                    "Tripatee completely changed how we holiday. The overwater villa in the Maldives was pure luxury. Snorkeling alongside manta rays is a memory our family will cherish forever."
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Sarah Jenkins</h4>
                    <span className="text-xs text-gray-400">Marketing Executive</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-72 text-left">
                <div className="flex flex-col gap-4">
                  <div className="flex text-amber-400 gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FiStar key={idx} className="fill-current text-sm" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed italic">
                    "Our experience in Tokyo was flawless. The local tour guides took us to hidden sushi restaurants we would have never found alone. The attention to detail is outstanding."
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Michael Cheng</h4>
                    <span className="text-xs text-gray-400">Software Architect</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-72 text-left">
                <div className="flex flex-col gap-4">
                  <div className="flex text-amber-400 gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FiStar key={idx} className="fill-current text-sm" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed italic">
                    "Paris was a dream come true! Skip-the-line tickets at Eiffel saved us hours. We spent the saved time enjoying champagne on a Seine river boat. Highly recommend booking through Tripatee!"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Emily Robinson</h4>
                    <span className="text-xs text-gray-400">Luxury Designer</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* 6. NEWSLETTER */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest">Newsletter</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Stay Inspired</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Subscribe to receive updates on premium flight offers, hidden luxury retreats, and seasonal trip recommendations.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="w-full max-w-lg flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address..."
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full px-5 py-3.5 border border-gray-200 rounded-full focus:outline-none focus:border-primary text-sm font-medium"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all shrink-0 shadow-lg shadow-primary/10"
            >
              Subscribe
            </button>
          </form>

          {newsletterMsg && <p className="text-sm font-semibold text-secondary">{newsletterMsg}</p>}
          {newsletterErr && <p className="text-sm font-semibold text-red-500">{newsletterErr}</p>}
        </div>
      </section>
    </div>
  );
};

export default Home;
