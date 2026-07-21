import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiClock, FiStar, FiFilter, FiSliders } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GridSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';

const Packages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter input states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const { toggleSaveTrip, user } = useAuth();

  // Load destinations once on mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/packages/destinations');
        setDestinations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDestinations();
  }, []);

  // Fetch package listings when parameters change
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const searchVal = searchParams.get('search');
        const destVal = searchParams.get('destination');
        const priceVal = searchParams.get('maxPrice');
        const sortVal = searchParams.get('sort');

        if (searchVal) queryParams.append('search', searchVal);
        if (destVal) queryParams.append('destination', destVal);
        if (priceVal) queryParams.append('maxPrice', priceVal);
        if (sortVal) queryParams.append('sort', sortVal);
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '6'); // 6 per page

        const res = await api.get(`/packages?${queryParams.toString()}`);
        setPackages(res.data.packages);
        setTotalPages(res.data.pages);
      } catch (err) {
        console.error('Error loading packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [searchParams, currentPage]);

  // Sync state values with URL params changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setDestination(searchParams.get('destination') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || '');
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = {};
    if (search) newParams.search = search;
    if (destination) newParams.destination = destination;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (sort) newParams.sort = sort;
    
    setSearchParams(newParams);
    setCurrentPage(1); // Reset page on filter apply
  };

  const handleResetFilters = () => {
    setSearch('');
    setDestination('');
    setMaxPrice('');
    setSort('');
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header Title */}
        <div className="mb-14 text-left">
          <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display flex items-center gap-1.5">
            <FiSliders className="text-sm" /> Bespoke Collections
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight font-display mt-2 leading-tight">
            Tour Packages
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* 1. FILTER CONTROLS SIDEBAR */}
          <div className="lg:col-span-1">
            <form 
              onSubmit={handleApplyFilters} 
              className="bg-white p-8 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col gap-6 text-left"
            >
              <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                <h3 className="font-extrabold text-primary text-base font-display flex items-center gap-2">
                  <FiFilter className="text-secondary" /> Filter Options
                </h3>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-primary/40 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Keyword Search */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Search Keywords</label>
                <div className="flex items-center gap-2.5 bg-gray-50/50 hover:bg-gray-50 border border-primary/5 rounded-xl px-4 py-3 transition-colors">
                  <FiSearch className="text-secondary text-sm shrink-0" />
                  <input
                    type="text"
                    placeholder="Paris, cruises, hiking..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs w-full text-primary font-semibold placeholder-primary/30"
                  />
                </div>
              </div>

              {/* Destination Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Destination</label>
                <div className="bg-gray-50/50 border border-primary/5 rounded-xl px-2 py-1">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs text-primary font-semibold w-full py-2 cursor-pointer focus:ring-0"
                  >
                    <option value="">Any Destination</option>
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}, {d.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Max Budget Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">
                  <span>Max Budget</span>
                  <span className="text-secondary font-black">
                    {maxPrice ? `₹${Number(maxPrice).toLocaleString('en-IN')}` : 'Unlimited'}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="1000000"
                  step="500"
                  value={maxPrice || '1000000'}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full accent-secondary cursor-pointer h-1 bg-primary/5 rounded-lg appearance-none"
                />
              </div>

              {/* Sorting */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Sort By</label>
                <div className="bg-gray-50/50 border border-primary/5 rounded-xl px-2 py-1">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs text-primary font-semibold w-full py-2 cursor-pointer focus:ring-0"
                  >
                    <option value="">Newest Added</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="ratingDesc">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg mt-2 font-display"
              >
                Apply Filters
              </button>
            </form>
          </div>

          {/* 2. PACKAGES GRID CONTAINER */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            {loading ? (
              <GridSkeleton count={6} />
            ) : packages.length === 0 ? (
              <EmptyState
                title="No Tour Packages Match"
                description="We couldn't find any tour packages matching your search terms. Try loosening your budget or keyword parameters."
                buttonText="Reset Filters"
                buttonLink="/packages"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {packages.map((pkg, index) => (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white rounded-[24px] overflow-hidden border border-primary/5 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group flex flex-col h-[520px] text-left"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-56 overflow-hidden shrink-0">
                        <img
                          src={pkg.gallery?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop'}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                        />
                        <div className="absolute top-4 left-4 bg-primary/95 text-secondary text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow backdrop-blur-sm">
                          {pkg.duration}
                        </div>
                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={() => toggleSaveTrip(pkg._id)}
                          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow bg-white hover:scale-105 transition-all duration-300 ${
                            user?.savedTrips?.some((t) => (t._id || t) === pkg._id)
                              ? 'text-red-500'
                              : 'text-primary/30 hover:text-red-500'
                          }`}
                        >
                          <FiStar className="fill-current text-sm" />
                        </button>
                      </div>

                      {/* Info Details */}
                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-secondary uppercase tracking-widest font-display">
                            <FiMapPin className="text-[12px]" /> 
                            <span>{pkg.destination?.name || 'Global'}</span>
                          </div>
                          <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1 font-display">
                            {pkg.title}
                          </h3>
                          <p className="text-xs text-primary/60 line-clamp-2 leading-relaxed font-light mt-0.5">
                            {pkg.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-end border-t border-primary/5 pt-5 mt-5">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-primary/40 font-semibold uppercase tracking-wider">Starting at</span>
                            <span className="text-xl font-black text-primary leading-none">₹{pkg.price.toLocaleString('en-IN')}</span>
                          </div>
                          <Link
                            to={`/packages/${pkg._id}`}
                            className="bg-primary hover:bg-secondary hover:text-primary text-white text-[11px] font-black uppercase tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 font-display"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-11 h-11 rounded-full text-xs font-black transition-all duration-300 flex items-center justify-center font-display ${
                            currentPage === pageNum
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-white border border-primary/5 text-primary/65 hover:border-secondary hover:text-secondary shadow-sm hover:scale-105'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
