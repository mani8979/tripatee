import React, { useState, useEffect } from 'react';
import { FiUser, FiBriefcase, FiHeart, FiSettings, FiMapPin, FiCalendar, FiDollarSign, FiTrash2, FiInfo, FiAward } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { user, updateProfile, toggleSaveTrip } = useAuth();
  
  // Dashboard Tabs: 'bookings', 'saved', 'profile'
  const [activeTab, setActiveTab] = useState('bookings');

  // Bookings list state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Edit profile states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load user bookings
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');
    setUpdating(true);

    const updateData = { name, email };
    if (password) updateData.password = password;

    const res = await updateProfile(updateData);
    setUpdating(false);

    if (res.success) {
      setProfileMsg('Profile details updated successfully!');
      setPassword('');
    } else {
      setProfileErr(res.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      // Refresh list
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">
        
        {/* Left Side: Sidebar navigation */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col gap-8 h-max">
          <div className="flex items-center gap-4 border-b border-primary/5 pb-6">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-secondary font-black text-lg border border-primary/5 shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-primary text-sm font-display">{user?.name}</h3>
              <span className="text-[10px] text-secondary font-black uppercase tracking-wider font-display">Verified Voyager</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left font-display cursor-pointer ${
                activeTab === 'bookings' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-primary/60 hover:bg-gray-50'
              }`}
            >
              <FiBriefcase className="text-base" /> <span>Booking History</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left font-display cursor-pointer ${
                activeTab === 'saved' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-primary/60 hover:bg-gray-50'
              }`}
            >
              <FiHeart className="text-base" /> <span>Saved Trips ({user?.savedTrips?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left font-display cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-primary/60 hover:bg-gray-50'
              }`}
            >
              <FiSettings className="text-base" /> <span>Profile Settings</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: BOOKING HISTORY */}
          {activeTab === 'bookings' && (
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-black text-primary font-display tracking-tight border-b border-primary/5 pb-4">Booking History</h2>
              
              {bookingsLoading ? (
                <div className="h-48 flex items-center justify-center bg-white rounded-[24px] border border-primary/5 shadow-luxury">
                  <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : bookings.length === 0 ? (
                <EmptyState
                  title="No Bookings Made Yet"
                  description="You haven't scheduled any tours. Explore our destinations and book your next journey!"
                  buttonText="Explore Packages"
                  buttonLink="/packages"
                />
              ) : (
                <div className="flex flex-col gap-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-white p-6 md:p-8 rounded-[24px] border border-primary/5 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center text-left"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src={booking.package?.gallery?.[0]}
                          alt="Tour"
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-primary/5"
                        />
                        <div className="flex flex-col gap-2">
                          <h4 className="font-extrabold text-primary text-base font-display">{booking.package?.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-primary/50 font-bold uppercase tracking-wider font-display">
                            <span className="flex items-center gap-1.5"><FiMapPin className="text-secondary" /> {booking.package?.destination?.name}</span>
                            <span className="flex items-center gap-1.5"><FiCalendar className="text-secondary" /> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><FiUser className="text-secondary" /> {booking.travelersCount} Guests</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between md:justify-end items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-primary/5 pt-5 md:pt-0">
                        <div className="flex flex-col text-left md:text-right">
                          <span className="text-[10px] text-primary/45 font-black uppercase tracking-wider pl-0.5">Total Paid</span>
                          <span className="text-lg font-black text-primary font-display leading-tight">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                          
                          {/* Payment status badge */}
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mt-2 w-max md:ml-auto font-display ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {booking.status !== 'cancelled' ? (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                              title="Cancel Booking"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          ) : (
                            <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-50 border border-red-100 px-3 py-1.5 rounded-md font-display">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED TRIPS */}
          {activeTab === 'saved' && (
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-black text-primary font-display tracking-tight border-b border-primary/5 pb-4">Saved Experiences</h2>
              
              {!user?.savedTrips || user.savedTrips.length === 0 ? (
                <EmptyState
                  title="No Saved Trips Yet"
                  description="Click the star icons on packages or popular destinations to compile your private bucket list."
                  buttonText="Browse Packages"
                  buttonLink="/packages"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {user.savedTrips.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="bg-white rounded-[24px] overflow-hidden border border-primary/5 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col h-[460px] text-left relative"
                    >
                      <div className="relative h-48 overflow-hidden shrink-0">
                        <img
                          src={pkg.gallery?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop'}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSaveTrip(pkg._id)}
                          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow text-red-500 hover:scale-105 transition-transform duration-300"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-grow">
                        <div className="flex flex-col gap-2.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-secondary font-display flex items-center gap-1">
                            <FiMapPin /> {pkg.destination?.name || 'Global'}
                          </span>
                          <h4 className="font-bold text-primary text-base line-clamp-1 font-display">{pkg.title}</h4>
                          <p className="text-xs text-primary/60 line-clamp-3 font-light leading-relaxed font-sans">{pkg.description}</p>
                        </div>

                        <div className="flex justify-between items-center border-t border-primary/5 pt-5 mt-4">
                          <span className="text-base font-black text-primary font-display">₹{pkg.price?.toLocaleString('en-IN')}</span>
                          <Link
                            to={`/packages/${pkg._id}`}
                            className="bg-primary hover:bg-secondary hover:text-primary text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 font-display"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-black text-primary font-display tracking-tight border-b border-primary/5 pb-4 font-display">Profile Settings</h2>
              
              <form onSubmit={handleUpdateProfile} className="bg-white p-8 md:p-10 rounded-[28px] border border-primary/5 shadow-luxury flex flex-col gap-6 text-left">
                {profileMsg && (
                  <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-semibold flex gap-2">
                    <FiInfo className="text-base text-emerald-500 shrink-0 mt-0.5" />
                    <span>{profileMsg}</span>
                  </div>
                )}
                
                {profileErr && (
                  <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold">
                    {profileErr}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:border-secondary focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:border-secondary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Change Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:border-secondary focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 font-display mt-2 cursor-pointer w-max px-8"
                >
                  {updating ? 'Saving Details...' : 'Save Profile Details'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
