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
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Title */}
        <div className="mb-10 text-left">
          <span className="text-primary text-xs font-extrabold uppercase tracking-widest flex items-center gap-1">
            <FiSliders /> Luxury Escapes
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mt-1">
            Tour Packages
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* 1. FILTER CONTROLS SIDEBAR */}
          <div className="lg:col-span-1">
            <form onSubmit={handleApplyFilters} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6 text-left">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                  <FiFilter className="text-primary" /> Filters
                </h3>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Keyword Search */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Search Keywords</label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5">
                  <FiSearch className="text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="e.g. Paris, cruise..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs w-full text-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Destination Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 font-medium w-full focus:outline-none"
                >
                  <option value="">Any Destination</option>
                  {destinations.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}, {d.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Budget Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <span>Max Budget</span>
                  <span className="text-primary font-extrabold">{maxPrice ? `₹${maxPrice}` : 'Unlimited'}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={maxPrice || '5000'}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full accent-primary cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                />
              </div>

              {/* Sorting */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 font-medium w-full focus:outline-none"
                >
                  <option value="">Newest Added</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="ratingDesc">Highest Rated</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/10"
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
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col h-[480px]"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-56 overflow-hidden shrink-0">
                        <img
                          src={pkg.gallery?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop'}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-primary text-white text-xxs font-extrabold uppercase px-2.5 py-1 rounded-full shadow">
                          {pkg.duration}
                        </div>
                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={() => toggleSaveTrip(pkg._id)}
                          className={`absolute top-4 right-4 w-8.5 h-8.5 rounded-full flex items-center justify-center shadow-lg transition-all bg-white hover:scale-105 ${
                            user?.savedTrips?.some((t) => (t._id || t) === pkg._id)
                              ? 'text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <FiStar className="fill-current text-xs" />
                        </button>
                      </div>

                      {/* Info Details */}
                      <div className="p-6 flex flex-col justify-between flex-1 text-left">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1 text-xxs font-semibold text-secondary">
                            <FiMapPin /> {pkg.destination?.name || 'Global'}
                          </div>
                          <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {pkg.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-0.5">
                            {pkg.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-4">
                          <div className="flex flex-col">
                            <span className="text-xxs text-gray-400 font-medium">Starting at</span>
                            <span className="text-xl font-extrabold text-primary">₹{pkg.price}</span>
                          </div>
                          <Link
                            to={`/packages/${pkg._id}`}
                            className="bg-secondary hover:bg-secondary-hover text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all"
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
                  <div className="flex justify-center items-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                            currentPage === pageNum
                              ? 'bg-primary text-white shadow-md shadow-primary/10'
                              : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
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
