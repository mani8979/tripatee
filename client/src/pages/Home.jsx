import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiSearch, FiMapPin, FiClock, FiStar, FiTrendingUp, FiGlobe, FiAward, 
  FiCalendar, FiUsers, FiShield, FiPercent, FiHeadphones, FiHeart, FiArrowRight 
} from 'react-icons/fi';
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
  const [allPackages, setAllPackages] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [newsletterErr, setNewsletterErr] = useState('');

  // Search parameters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDest, setSelectedDest] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [travellers, setTravellers] = useState('2');

  const navigate = useNavigate();
  const { toggleSaveTrip, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destRes = await api.get('/packages/destinations');
        // Get popular ones first
        const popDests = destRes.data.filter(d => d.popular).slice(0, 4);
        setDestinations(popDests.length > 0 ? popDests : destRes.data.slice(0, 4));

        const pkgRes = await api.get('/packages?featured=true&limit=6');
        setFeaturedPackages(pkgRes.data.packages);

        // Fetch all packages to compute minimum prices and average ratings per destination
        const allPkgRes = await api.get('/packages?limit=100');
        setAllPackages(allPkgRes.data.packages || []);

        // Fetch blogs
        try {
          const blogRes = await api.get('/blogs?limit=3');
          setBlogs(blogRes.data || []);
        } catch (bErr) {
          console.warn('Error fetching blogs, using default details:', bErr);
        }
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

  // Helper to dynamically calculate starting price and average rating for a destination from database packages
  const getDestinationDetails = (destId, destName) => {
    const matchedPackages = allPackages.filter(p => {
      const pkgDestId = p.destination?._id || p.destination;
      return pkgDestId === destId || (p.destination?.name && p.destination.name.toLowerCase() === destName.toLowerCase());
    });
    
    const minPrice = matchedPackages.length > 0 
      ? Math.min(...matchedPackages.map(p => p.price)) 
      : null;
    
    const avgRating = matchedPackages.length > 0 
      ? (matchedPackages.reduce((acc, p) => acc + (p.ratings || 0), 0) / matchedPackages.length).toFixed(1) 
      : null;

    return { 
      minPrice: minPrice ? `₹${minPrice.toLocaleString('en-IN')}` : '₹49,999', 
      avgRating: avgRating && avgRating > 0 ? avgRating : '4.9' 
    };
  };

  // Default blogs fallback if none exist in backend yet
  const displayBlogs = blogs.length > 0 ? blogs.slice(0, 3) : [
    {
      _id: 'blog1',
      title: 'Chasing Sunsets in Santorini: The Ultimate Guide',
      category: 'Luxury',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop',
      createdAt: '2026-06-15T00:00:00Z',
    },
    {
      _id: 'blog2',
      title: 'Hidden Ryokans of Kyoto: Escape into Zen Living',
      category: 'Experiences',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop',
      createdAt: '2026-07-02T00:00:00Z',
    },
    {
      _id: 'blog3',
      title: 'Alpine Splendor: Sky-high Dining in Zermatt',
      category: 'Adventure',
      image: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=600&auto=format&fit=crop',
      createdAt: '2026-07-10T00:00:00Z',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center overflow-hidden pt-36 pb-20">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/araku-view-point-clouds-passing.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-[0.55] scale-100 transition-transform duration-[10000ms] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-warm-white/90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/25 px-5 py-2 rounded-full backdrop-blur-md"
          >
            <span className="text-secondary text-xs md:text-sm font-extrabold uppercase tracking-widest font-display">
              Luxury Travel Crafted For You
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight font-display leading-[1.08] text-white"
          >
            Journey Beyond, <br />
            <span className="bg-gradient-to-r from-secondary via-amber-200 to-secondary bg-clip-text text-transparent">
              Discover the Extraordinary
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-base md:text-lg text-gray-200/95 max-w-2xl font-sans font-light leading-relaxed mb-6"
          >
            Unlock elite collections of hand-picked itineraries, 5-star hotels, and authentic experiences worldwide with Flashmob Travels.
          </motion.p>

          {/* Search Form Panel */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            onSubmit={handleSearch}
            className="w-full max-w-5xl glass-card rounded-[24px] p-6 lg:p-8 shadow-luxury flex flex-col gap-6 text-primary"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Field 1: Destination Search Keywords */}
              <div className="flex flex-col gap-1.5 text-left border-r border-primary/5 last:border-0 pr-2">
                <span className="text-[11px] font-bold text-primary/50 uppercase tracking-widest pl-1">Where to?</span>
                <div className="flex items-center gap-2.5 bg-gray-50/50 hover:bg-gray-50 border border-primary/5 hover:border-secondary/35 rounded-xl px-4 py-3 transition-all duration-300">
                  <FiSearch className="text-secondary text-lg shrink-0" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-[13px] font-semibold text-primary w-full placeholder-primary/40 focus:ring-0"
                  />
                </div>
              </div>

              {/* Field 2: Check-in Date */}
              <div className="flex flex-col gap-1.5 text-left border-r border-primary/5 last:border-0 pr-2">
                <span className="text-[11px] font-bold text-primary/50 uppercase tracking-widest pl-1">Check-in</span>
                <div className="flex items-center gap-2.5 bg-gray-50/50 hover:bg-gray-50 border border-primary/5 hover:border-secondary/35 rounded-xl px-4 py-3 transition-all duration-300">
                  <FiCalendar className="text-secondary text-lg shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-transparent border-none outline-none text-[13px] font-semibold text-primary w-full focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Field 3: Check-out Date */}
              <div className="flex flex-col gap-1.5 text-left border-r border-primary/5 last:border-0 pr-2">
                <span className="text-[11px] font-bold text-primary/50 uppercase tracking-widest pl-1">Check-out</span>
                <div className="flex items-center gap-2.5 bg-gray-50/50 hover:bg-gray-50 border border-primary/5 hover:border-secondary/35 rounded-xl px-4 py-3 transition-all duration-300">
                  <FiCalendar className="text-secondary text-lg shrink-0" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-transparent border-none outline-none text-[13px] font-semibold text-primary w-full focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Field 4: Guests */}
              <div className="flex flex-col gap-1.5 text-left border-r border-primary/5 last:border-0 pr-2">
                <span className="text-[11px] font-bold text-primary/50 uppercase tracking-widest pl-1">Guests</span>
                <div className="flex items-center gap-2.5 bg-gray-50/50 hover:bg-gray-50 border border-primary/5 hover:border-secondary/35 rounded-xl px-4 py-3 transition-all duration-300">
                  <FiUsers className="text-secondary text-lg shrink-0" />
                  <select
                    value={travellers}
                    onChange={(e) => setTravellers(e.target.value)}
                    className="bg-transparent border-none outline-none text-[13px] font-semibold text-primary w-full focus:ring-0 cursor-pointer"
                  >
                    <option value="1">1 Traveller</option>
                    <option value="2">2 Travellers</option>
                    <option value="3">3 Travellers</option>
                    <option value="4">4 Travellers</option>
                    <option value="5+">5+ Travellers</option>
                  </select>
                </div>
              </div>

              {/* Field 5: Budget */}
              <div className="flex flex-col gap-1.5 text-left">
                <span className="text-[11px] font-bold text-primary/50 uppercase tracking-widest pl-1">Max Budget</span>
                <div className="flex items-center gap-2 bg-gray-50/50 hover:bg-gray-50 border border-primary/5 hover:border-secondary/35 rounded-xl px-4 py-3 transition-all duration-300">
                  <span className="text-secondary text-sm font-bold pl-0.5 select-none">₹</span>
                  <input
                    type="number"
                    placeholder="Max budget (INR)"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="bg-transparent border-none outline-none text-[13px] font-semibold text-primary w-full placeholder-primary/40 focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Custom submit block */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-primary/5 pt-5 mt-2">
              <div className="flex items-center gap-2.5 text-xs text-primary/60 font-semibold pl-1">
                <FiMapPin className="text-secondary text-sm" />
                <span>Popular this week: Maldives, Paris, Kyoto, Araku</span>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-secondary hover:text-primary text-white font-extrabold text-sm px-10 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-transparent hover:border-primary/10 tracking-wider uppercase font-display"
              >
                Search Luxury Tours
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="relative z-20 -mt-10 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 md:p-10 rounded-[24px] shadow-luxury border border-primary/5">
          <div className="flex gap-4 items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0">
              <FiShield />
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-primary font-display">Safe & Secure</h4>
              <p className="text-xs text-primary/60 leading-relaxed mt-1">Verify 100% payments with ultimate travel liability protection plans.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0">
              <FiPercent />
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-primary font-display">Best Price Guarantee</h4>
              <p className="text-xs text-primary/60 leading-relaxed mt-1">Found cheaper? We match and credit back 110% of the difference.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0">
              <FiHeadphones />
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-primary font-display">24/7 Elite Support</h4>
              <p className="text-xs text-primary/60 leading-relaxed mt-1">Your personal digital concierge is a WhatsApp away, anywhere.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0">
              <FiHeart />
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-primary font-display">Handpicked Escapes</h4>
              <p className="text-xs text-primary/60 leading-relaxed mt-1">Five-star premium suites, private yachts, and vetted tour hosts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR DESTINATIONS */}
      <section className="py-28 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="flex flex-col items-center gap-3 mb-16">
          <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display">Explore the World</span>
          <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight font-display">Popular Destinations</h2>
          <p className="text-sm md:text-base text-primary/60 max-w-md leading-relaxed mt-1">
            Handpicked escapes that will take your breath away.
          </p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((dest) => {
              const details = getDestinationDetails(dest._id, dest.name);
              return (
                <div
                  key={dest._id}
                  onClick={() => navigate(`/packages?destination=${dest._id}`)}
                  className="group relative h-[420px] rounded-[24px] overflow-hidden shadow-luxury hover:shadow-luxury-hover cursor-pointer transition-all duration-500 hover:-translate-y-2 text-left"
                >
                  {/* Photo background */}
                  <img
                    src={dest.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop'}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
                  />
                  {/* Overlay shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-white/95 px-3.5 py-1.5 rounded-full shadow-sm text-primary font-bold text-xs">
                    <FiStar className="fill-current text-secondary" />
                    <span>{details.avgRating}</span>
                  </div>

                  {/* Save star click block (absolute top left) */}
                  <div className="absolute top-5 left-5 bg-white/15 hover:bg-white/20 border border-white/20 p-2.5 rounded-full backdrop-blur-sm text-white hover:text-secondary hover:scale-110 transition-all duration-300">
                    <FiHeart className="text-sm fill-transparent" />
                  </div>

                  {/* Details bottom text content */}
                  <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col text-white">
                    <div className="inline-flex items-center gap-1.5 bg-secondary text-primary font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-md w-max mb-3">
                      <FiMapPin className="text-[11px]" />
                      <span>{dest.country}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold font-display tracking-tight leading-tight">
                      {dest.name}
                    </h3>
                    <p className="text-[12px] text-gray-300 font-light mt-1.5 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                    
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Starts from</span>
                        <span className="text-lg font-black text-secondary">{details.minPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-secondary transition-colors flex items-center gap-1">
                        Explore <FiArrowRight className="text-sm" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. FEATURED PACKAGES */}
      <section className="py-28 bg-white border-t border-primary/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="flex flex-col gap-3 text-left">
              <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display">Bespoke Expeditions</span>
              <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight font-display">Featured Tour Packages</h2>
            </div>
            <Link
              to="/packages"
              className="group text-primary hover:text-secondary font-bold text-sm flex items-center gap-1.5 transition-colors border border-primary/10 hover:border-secondary px-6 py-3 rounded-full"
            >
              Browse All Packages <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-20"
            >
              {featuredPackages.map((pkg) => (
                <SwiperSlide key={pkg._id}>
                  <div className="bg-white rounded-[24px] overflow-hidden border border-primary/5 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group flex flex-col h-[550px] text-left">
                    {/* Cover image */}
                    <div className="relative h-64 overflow-hidden shrink-0">
                      <img
                        src={pkg.gallery?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop'}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                      />
                      <div className="absolute top-5 left-5 bg-primary/90 text-secondary text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow backdrop-blur-sm">
                        {pkg.duration}
                      </div>
                      
                      {/* Save Trip Button */}
                      <button
                        onClick={() => toggleSaveTrip(pkg._id)}
                        className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center shadow bg-white hover:scale-105 transition-all duration-300 ${
                          user?.savedTrips?.some((t) => (t._id || t) === pkg._id)
                            ? 'text-red-500'
                            : 'text-primary/30 hover:text-red-500'
                        }`}
                      >
                        <FiStar className="fill-current text-sm" />
                      </button>
                    </div>

                    {/* Content details */}
                    <div className="p-8 flex flex-col justify-between flex-1">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-widest font-display">
                          <FiMapPin className="text-[13px]" /> 
                          <span>{pkg.destination?.name || 'Global'}</span>
                        </div>
                        <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1 font-display">
                          {pkg.title}
                        </h3>
                        <p className="text-[13.5px] text-primary/60 line-clamp-3 leading-relaxed font-light">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-end border-t border-primary/5 pt-6 mt-6">
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-primary/40 font-semibold uppercase tracking-wider pl-0.5">Starting at</span>
                          <span className="text-2xl font-black text-primary leading-none">₹{pkg.price.toLocaleString('en-IN')}</span>
                        </div>
                        <Link
                          to={`/packages/${pkg._id}`}
                          className="bg-primary hover:bg-secondary hover:text-primary text-white text-xs font-black tracking-wider uppercase px-7 py-3 rounded-full transition-all duration-300 font-display"
                        >
                          Book Now
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

      {/* 5. WHY CHOOSE US */}
      <section className="py-28 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Travel Photo */}
          <div className="relative group">
            <div className="absolute -inset-4 rounded-[28px] border-2 border-secondary/20 scale-95 group-hover:scale-100 transition-all duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop"
              alt="Luxury Travel Experience"
              className="relative z-10 w-full h-[500px] object-cover rounded-[24px] shadow-luxury"
            />
            {/* Overlay badge */}
            <div className="absolute bottom-8 right-8 z-20 bg-primary/95 text-white p-6 rounded-2xl shadow-xl backdrop-blur-sm max-w-xs text-left border border-white/5">
              <span className="text-secondary font-black text-3xl font-display">100%</span>
              <h5 className="font-extrabold text-sm mt-1 uppercase tracking-wide">Bespoke Concierge</h5>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">Every flight, yacht charter, and villa checkout is supervised personally.</p>
            </div>
          </div>

          {/* Right: Copywriting Details */}
          <div className="flex flex-col gap-6 text-left">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight font-display">
              Unrivaled Luxury, Seamless Travel
            </h2>
            <p className="text-sm md:text-base text-primary/65 leading-relaxed font-light">
              We redefine global vacations by crafting personalized itineraries designed to match your individual standard of living. Our priority is comfort, privacy, and authentic elegance.
            </p>
            
            <div className="flex flex-col gap-5 mt-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center shrink-0 text-sm mt-0.5 shadow-sm">
                  <FiGlobe />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary font-display">Elite Global Partners</h4>
                  <p className="text-xs text-primary/60 mt-1 leading-relaxed">Direct links to 5-star hotel keys, private local transport lines, and yacht providers.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center shrink-0 text-sm mt-0.5 shadow-sm">
                  <FiTrendingUp />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary font-display">Tailor-Made Schedules</h4>
                  <p className="text-xs text-primary/60 mt-1 leading-relaxed">Work with local adventure designers to shape every hour to your preference.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center shrink-0 text-sm mt-0.5 shadow-sm">
                  <FiAward />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary font-display">Award-Winning Hosts</h4>
                  <p className="text-xs text-primary/60 mt-1 leading-relaxed">Our tour host operators are fully certified and hold reviews exceeding 4.9/5 stars.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STATISTICS BANNER */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&auto=format&fit=crop"
            alt="Stats background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary font-display">15K+</span>
            <span className="text-[11px] text-gray-400 font-bold tracking-widest uppercase font-display pl-0.5">Happy Travelers</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary font-display">500+</span>
            <span className="text-[11px] text-gray-400 font-bold tracking-widest uppercase font-display pl-0.5">Luxury Trips</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary font-display">120+</span>
            <span className="text-[11px] text-gray-400 font-bold tracking-widest uppercase font-display pl-0.5">Elite Destinations</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary font-display">10+</span>
            <span className="text-[11px] text-gray-400 font-bold tracking-widest uppercase font-display pl-0.5">Years Experience</span>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-28 bg-white border-b border-primary/5 text-center">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="flex flex-col items-center gap-3">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight font-display">Voices of Our Voyagers</h2>
            <p className="text-sm md:text-base text-primary/60 max-w-md leading-relaxed mt-1">Read what elite travelers write about Flashmob Travels</p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 7000 }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-20"
          >
            <SwiperSlide>
              <div className="bg-white p-10 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col justify-between h-[340px] text-left">
                <div className="flex flex-col gap-5">
                  <div className="flex text-secondary gap-1 text-sm">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FiStar key={idx} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-[14px] text-primary/75 leading-relaxed font-light italic">
                    "Flashmob Travels completely changed how we holiday. The overwater villa in the Maldives was pure luxury. Snorkeling alongside manta rays is a memory our family will cherish forever."
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-primary/5 pt-5">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop"
                    alt="Sarah Jenkins"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-primary font-display">Sarah Jenkins</h4>
                    <span className="text-xs text-primary/40 font-semibold">Marketing Executive</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white p-10 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col justify-between h-[340px] text-left">
                <div className="flex flex-col gap-5">
                  <div className="flex text-secondary gap-1 text-sm">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FiStar key={idx} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-[14px] text-primary/75 leading-relaxed font-light italic">
                    "Our experience in Tokyo was flawless. The local tour guides took us to hidden sushi restaurants we would have never found alone. The attention to detail is outstanding."
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-primary/5 pt-5">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
                    alt="Michael Cheng"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-primary font-display">Michael Cheng</h4>
                    <span className="text-xs text-primary/40 font-semibold">Software Architect</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white p-10 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col justify-between h-[340px] text-left">
                <div className="flex flex-col gap-5">
                  <div className="flex text-secondary gap-1 text-sm">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FiStar key={idx} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-[14px] text-primary/75 leading-relaxed font-light italic">
                    "Paris was a dream come true! Skip-the-line tickets at Eiffel saved us hours. We spent the saved time enjoying champagne on a Seine river boat. Highly recommend booking through Flashmob Travels!"
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-primary/5 pt-5">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop"
                    alt="Emily Robinson"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-primary font-display">Emily Robinson</h4>
                    <span className="text-xs text-primary/40 font-semibold">Luxury Designer</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* 8. BLOG PREVIEW SECTION */}
      <section className="py-28 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 text-left">
            <div className="flex flex-col gap-3">
              <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display">Journal Feed</span>
              <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight font-display">Travel Inspiration</h2>
            </div>
            <Link
              to="/blog"
              className="text-primary hover:text-secondary font-bold text-sm flex items-center gap-1.5 transition-colors border border-primary/10 hover:border-secondary px-6 py-3 rounded-full"
            >
              Read All Articles <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-[24px] overflow-hidden border border-primary/5 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group flex flex-col h-[460px] text-left cursor-pointer"
                onClick={() => navigate('/blog')}
              >
                <div className="relative h-56 overflow-hidden shrink-0">
                  <img
                    src={blog.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-5 left-5 bg-white text-primary font-black uppercase text-[10px] tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                    {blog.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div className="flex flex-col gap-3">
                    <span className="text-[11px] text-primary/40 font-bold uppercase tracking-wider">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug font-display">
                      {blog.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-primary group-hover:text-secondary flex items-center gap-1 mt-4">
                    Read Story →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full mb-28">
        <div className="relative rounded-[32px] overflow-hidden bg-primary text-white p-10 md:p-16 lg:p-20 text-center flex flex-col items-center gap-8 shadow-luxury border border-white/5">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent opacity-70"></div>
          
          <div className="relative z-10 flex flex-col gap-3">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display">Newsletter</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display">Stay Inspired</h2>
            <p className="text-sm md:text-base text-gray-300 max-w-md mx-auto leading-relaxed mt-1 font-light">
              Subscribe to receive updates on premium flight offers, hidden luxury retreats, and seasonal trip recommendations.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="relative z-10 w-full max-w-xl flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address..."
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full px-6 py-4 bg-white text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-semibold border-none placeholder-primary/45"
            />
            <button
              type="submit"
              className="bg-secondary hover:bg-amber-400 text-primary font-black text-xs uppercase tracking-wider px-10 py-4.5 rounded-xl transition-all duration-300 shrink-0 shadow-lg font-display"
            >
              Subscribe
            </button>
          </form>

          {newsletterMsg && <p className="relative z-10 text-sm font-bold text-secondary">{newsletterMsg}</p>}
          {newsletterErr && <p className="relative z-10 text-sm font-bold text-red-400">{newsletterErr}</p>}
        </div>
      </section>
    </div>
  );
};

export default Home;
