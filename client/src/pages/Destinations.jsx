import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiCompass } from 'react-icons/fi';
import api from '../services/api';
import { motion } from 'framer-motion';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/packages/destinations');
        setDestinations(res.data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDestinationClick = (destId) => {
    navigate(`/packages?destination=${destId}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2 max-w-xl text-left">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest flex items-center gap-1">
              <FiCompass /> Discover Worlds
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Explore Our Destinations
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mt-1">
              From the historic cobblestone alleys of Paris to the digital lights of Tokyo, select a destination to browse curated luxury itineraries.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-gray-200 shadow-sm w-full md:max-w-md shrink-0">
            <FiSearch className="text-primary text-lg shrink-0" />
            <input
              type="text"
              placeholder="Search by city or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full font-medium text-gray-700"
            />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <FiMapPin className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No Destinations Found</h3>
            <p className="text-sm text-gray-500 mt-1">Try searching for other keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest, index) => (
              <motion.div
                key={dest._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleDestinationClick(dest._id)}
                className="relative group h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={dest.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop'}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.7]"
                />
                
                {/* Gradient Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 text-left text-white flex flex-col gap-2">
                  <span className="text-secondary text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <FiMapPin /> {dest.country}
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight">{dest.name}</h3>
                  <p className="text-xs text-gray-200/90 leading-relaxed font-light mt-1 line-clamp-2">
                    {dest.description}
                  </p>
                  
                  <span className="text-white text-xs font-bold mt-4 flex items-center gap-1 group-hover:text-secondary transition-colors">
                    View Tour Packages →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
