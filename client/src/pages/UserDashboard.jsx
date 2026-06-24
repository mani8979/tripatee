import React, { useState, useEffect } from 'react';
import { FiUser, FiBriefcase, FiHeart, FiSettings, FiMapPin, FiCalendar, FiDollarSign, FiTrash2, FiInfo } from 'react-icons/fi';
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
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-10 text-left">
        
        {/* Left Side: Sidebar navigation */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6 h-max">
          <div className="flex items-center gap-3.5 border-b border-gray-50 pb-5">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm">{user?.name}</h3>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Verified Voyager</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'bookings' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiBriefcase className="text-lg" /> Booking History
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'saved' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiHeart className="text-lg" /> Saved Trips ({user?.savedTrips?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'profile' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiSettings className="text-lg" /> Profile Settings
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: BOOKING HISTORY */}
          {activeTab === 'bookings' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-gray-900">Booking History</h2>
              
              {bookingsLoading ? (
                <div className="h-48 flex items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
                      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 justify-between items-start md:items-center text-left"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={booking.package?.gallery?.[0]}
                          alt="Tour"
                          className="w-20 h-20 rounded-2xl object-cover shrink-0"
                        />
                        <div className="flex flex-col gap-1.5">
                          <h4 className="font-extrabold text-gray-900 text-sm">{booking.package?.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-500 font-semibold">
                            <span className="flex items-center gap-1"><FiMapPin /> {booking.package?.destination?.name}</span>
                            <span className="flex items-center gap-1"><FiCalendar /> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><FiUser /> {booking.travelersCount} Guests</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between md:justify-end items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                        <div className="flex flex-col text-left md:text-right">
                          <span className="text-[10px] text-gray-400 font-medium">Total Paid</span>
                          <span className="text-base font-extrabold text-primary">₹{booking.totalAmount}</span>
                          
                          {/* Payment status badge */}
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1.5 w-max md:ml-auto ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {booking.status !== 'cancelled' ? (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                              title="Cancel Booking"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
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
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-gray-900">Bookmarked Tours</h2>
              
              {!user?.savedTrips || user.savedTrips.length === 0 ? (
                <EmptyState
                  title="No Bookmarks Registered"
                  description="Keep track of your dream vacations. Tap the star icon on any package to add it here!"
                  buttonText="Explore Packages"
                  buttonLink="/packages"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.savedTrips.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-[420px]"
                    >
                      <div className="relative h-48 overflow-hidden shrink-0">
                        <img
                          src={pkg.gallery?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop'}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => toggleSaveTrip(pkg._id)}
                          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow text-red-500 hover:scale-105 transition-all"
                        >
                          <FiTrash2 className="text-xs" />
                        </button>
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-1 text-left">
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-semibold text-secondary flex items-center gap-1">
                            <FiMapPin /> {pkg.destination?.name}
                          </span>
                          <h3 className="text-base font-extrabold text-gray-900 line-clamp-1">{pkg.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{pkg.description}</p>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-4">
                          <span className="text-lg font-extrabold text-primary">₹{pkg.price}</span>
                          <Link
                            to={`/packages/${pkg._id}`}
                            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-full transition-all"
                          >
                            Details
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
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-gray-900">Profile Settings</h2>
              
              <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6">
                
                {profileMsg && <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl">{profileMsg}</p>}
                {profileErr && <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-xl">{profileErr}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>

                {/* Password Change */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">New Password (leave empty to keep current)</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary/10 self-start disabled:opacity-50"
                >
                  {updating ? 'Saving Changes...' : 'Save Settings'}
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
