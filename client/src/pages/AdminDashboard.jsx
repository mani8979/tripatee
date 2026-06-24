import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiBriefcase, FiPackage, FiUsers, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiImage, FiFileText } from 'react-icons/fi';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  // Backend dashboard data states
  const [metrics, setMetrics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Package Form state (Add / Edit Modals)
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [selectedDest, setSelectedDest] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState('10');
  const [featured, setFeatured] = useState(false);

  // Dynamic Lists Form Fields
  const [inclusions, setInclusions] = useState([]);
  const [incInput, setIncInput] = useState('');
  const [exclusions, setExclusions] = useState([]);
  const [excInput, setExcInput] = useState('');

  // Daily Itineraries form fields
  const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '' }]);

  // Media files uploads
  const [galleryFiles, setGalleryFiles] = useState([]);

  // Submission messages
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/dashboard');
      setMetrics(statsRes.data.metrics);
      setBookings(statsRes.data.recentBookings);
      setUsers(statsRes.data.users);

      const pkgRes = await api.get('/packages?limit=50');
      setPackages(pkgRes.data.packages);

      const destRes = await api.get('/packages/destinations');
      setDestinations(destRes.data);
      if (destRes.data.length > 0) {
        setSelectedDest(destRes.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching admin details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAddItineraryDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }]);
  };

  const handleRemoveItineraryDay = (index) => {
    const updated = itinerary.filter((_, i) => i !== index).map((day, idx) => ({
      ...day,
      day: idx + 1,
    }));
    setItinerary(updated);
  };

  const handleItineraryChange = (index, field, value) => {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  };

  const handleAddInclusion = () => {
    if (incInput.trim()) {
      setInclusions([...inclusions, incInput.trim()]);
      setIncInput('');
    }
  };

  const handleAddExclusion = () => {
    if (excInput.trim()) {
      setExclusions([...exclusions, excInput.trim()]);
      setExcInput('');
    }
  };

  const handleFileChange = (e) => {
    setGalleryFiles(Array.from(e.target.files));
  };

  const handleCreateOrUpdatePackage = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      // Build form-data payload for multer images parser
      const formData = new FormData();
      formData.append('title', title);
      formData.append('destination', selectedDest);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('duration', duration);
      formData.append('maxGroupSize', maxGroupSize);
      formData.append('featured', featured.toString());
      formData.append('inclusions', JSON.stringify(inclusions));
      formData.append('exclusions', JSON.stringify(exclusions));
      formData.append('itinerary', JSON.stringify(itinerary));

      // Append selected files
      galleryFiles.forEach((file) => {
        formData.append('gallery', file);
      });

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      if (editingPackageId) {
        await api.put(`/packages/${editingPackageId}`, formData, config);
        alert('Package updated successfully!');
      } else {
        await api.post('/packages', formData, config);
        alert('New Package created successfully!');
      }

      setShowPackageModal(false);
      resetPackageForm();
      loadDashboardData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error processing package form.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditPackage = (pkg) => {
    setEditingPackageId(pkg._id);
    setTitle(pkg.title);
    setSelectedDest(pkg.destination?._id || destinations[0]?._id);
    setDescription(pkg.description);
    setPrice(pkg.price.toString());
    setDuration(pkg.duration);
    setMaxGroupSize(pkg.maxGroupSize.toString());
    setFeatured(pkg.featured || false);
    setInclusions(pkg.inclusions || []);
    setExclusions(pkg.exclusions || []);
    setItinerary(pkg.itinerary || [{ day: 1, title: '', description: '' }]);
    setShowPackageModal(true);
  };

  const handleDeletePackage = async (pkgId) => {
    if (!window.confirm('Are you sure you want to delete this tour package permanently?')) return;
    try {
      await api.delete(`/packages/${pkgId}`);
      alert('Package deleted successfully');
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete package');
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });
      alert('Booking status updated successfully');
      loadDashboardData();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const handleBookingPaymentChange = async (bookingId, newPaymentStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, { paymentStatus: newPaymentStatus });
      alert('Payment status updated successfully');
      loadDashboardData();
    } catch (err) {
      alert('Failed to update payment status');
    }
  };

  const resetPackageForm = () => {
    setEditingPackageId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setDuration('');
    setMaxGroupSize('10');
    setFeatured(false);
    setInclusions([]);
    setExclusions([]);
    setItinerary([{ day: 1, title: '', description: '' }]);
    setGalleryFiles([]);
    setFormError('');
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
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-10 text-left">
        
        {/* Left Sidebar navigation */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6 h-max">
          <div className="border-b border-gray-50 pb-4">
            <h3 className="font-extrabold text-gray-900 text-sm">Control Panel</h3>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">RBAC Level: Admin</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'analytics' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiTrendingUp className="text-lg" /> Dashboard Stats
            </button>

            <button
              onClick={() => {
                setActiveTab('packages');
                resetPackageForm();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'packages' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiPackage className="text-lg" /> Manage Packages
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'bookings' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiBriefcase className="text-lg" /> Manage Bookings
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'users' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiUsers className="text-lg" /> Registered Users
            </button>
          </div>
        </div>

        {/* Right Dashboard panel */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          
          {/* TAB 1: ANALYTICS DASHBOARD */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-8">
              {/* Analytics KPI grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2">
                  <span className="text-lg font-extrabold text-secondary leading-none w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center select-none">₹</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Revenue</span>
                  <span className="text-2xl font-extrabold text-gray-900">₹{metrics?.totalRevenue}</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2">
                  <FiBriefcase className="text-2xl text-primary" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bookings count</span>
                  <span className="text-2xl font-extrabold text-gray-900">{metrics?.totalBookings}</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2">
                  <FiPackage className="text-2xl text-amber-500" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Packages count</span>
                  <span className="text-2xl font-extrabold text-gray-900">{metrics?.totalPackages}</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2">
                  <FiUsers className="text-2xl text-violet-500" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Travelers</span>
                  <span className="text-2xl font-extrabold text-gray-900">{metrics?.totalUsers}</span>
                </div>
              </div>

              {/* Recent bookings list */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
                <h3 className="font-extrabold text-gray-900 text-sm border-b border-gray-50 pb-4 mb-6">Recent Bookings Log</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase font-bold tracking-wider border-b border-gray-100">
                        <th className="pb-3 text-left">User</th>
                        <th className="pb-3 text-left">Tour Package</th>
                        <th className="pb-3 text-left">Pricing</th>
                        <th className="pb-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="py-4 text-gray-800">{booking.user?.name}</td>
                          <td className="py-4 text-gray-950 font-bold">{booking.package?.title}</td>
                          <td className="py-4 text-primary font-bold">₹{booking.totalAmount}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE TOUR PACKAGES */}
          {activeTab === 'packages' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-extrabold text-gray-900">Manage Tour Packages</h2>
                <button
                  onClick={() => {
                    resetPackageForm();
                    setShowPackageModal(true);
                  }}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-primary/15 flex items-center gap-1.5 transition-all"
                >
                  <FiPlus className="text-sm" /> Add Tour
                </button>
              </div>

              {/* Packages grid list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pkg.gallery?.[0]}
                        alt="Tour"
                        className="w-16 h-16 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex flex-col gap-1 text-left">
                        <h4 className="font-extrabold text-gray-900 text-xs line-clamp-1">{pkg.title}</h4>
                        <span className="text-[10px] text-gray-400 font-bold">₹{pkg.price} • {pkg.duration}</span>
                        {pkg.featured && (
                          <span className="text-[8px] bg-secondary/10 text-secondary w-max px-1.5 py-0.5 rounded font-extrabold uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        className="w-8.5 h-8.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                      >
                        <FiEdit2 className="text-xs" />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg._id)}
                        className="w-8.5 h-8.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-gray-900">Manage Customer Bookings</h2>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase font-bold tracking-wider border-b border-gray-100">
                        <th className="pb-3 text-left">User Details</th>
                        <th className="pb-3 text-left">Tour Title</th>
                        <th className="pb-3 text-left">Departure Date</th>
                        <th className="pb-3 text-left">Payment Status</th>
                        <th className="pb-3 text-left">Order Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {users.length > 0 && bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="py-4 text-left">
                            <p className="text-gray-800 font-bold">{booking.user?.name}</p>
                            <p className="text-[10px] text-gray-400">{booking.user?.email}</p>
                          </td>
                          <td className="py-4 text-gray-950 font-bold">{booking.package?.title}</td>
                          <td className="py-4 text-gray-500">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                          
                          {/* Payment status edit drop down */}
                          <td className="py-4">
                            <select
                              value={booking.paymentStatus}
                              onChange={(e) => handleBookingPaymentChange(booking._id, e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-[10px] focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="refunded">Refunded</option>
                            </select>
                          </td>

                          {/* Order Status edit drop down */}
                          <td className="py-4">
                            <select
                              value={booking.status}
                              onChange={(e) => handleBookingStatusChange(booking._id, e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-[10px] focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REGISTERED USERS */}
          {activeTab === 'users' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-gray-900">Registered Users Directory</h2>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase font-bold tracking-wider border-b border-gray-100">
                        <th className="pb-3 text-left">Name</th>
                        <th className="pb-3 text-left">Email Address</th>
                        <th className="pb-3 text-left">Role Position</th>
                        <th className="pb-3 text-left">Verification State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="py-4 text-gray-900 font-bold">{u.name}</td>
                          <td className="py-4 text-gray-500">{u.email}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                            }`}>
                              {u.isVerified ? 'Verified' : 'Pending OTP'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CREATE / EDIT TOUR PACKAGE MODAL */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 relative text-left shadow-2xl">
            <button
              onClick={() => setShowPackageModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <FiX className="text-xl" />
            </button>

            <h3 className="text-xl font-extrabold text-gray-900 mb-6">
              {editingPackageId ? 'Edit Tour Package' : 'Create Tour Package'}
            </h3>

            {formError && <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-xl mb-6">{formError}</p>}

            <form onSubmit={handleCreateOrUpdatePackage} className="flex flex-col gap-6 text-xs text-gray-700">
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Tour Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Grand Voyage to Kyoto"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Associated Destination</label>
                  <select
                    value={selectedDest}
                    onChange={(e) => setSelectedDest(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}, {d.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Price (USD)</label>
                  <input
                    type="number"
                    required
                    placeholder="1500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Duration Description</label>
                  <input
                    type="text"
                    required
                    placeholder="5 Days / 4 Nights"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Max Group Size</label>
                  <input
                    type="number"
                    required
                    placeholder="12"
                    value={maxGroupSize}
                    onChange={(e) => setMaxGroupSize(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Tour Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Detail the package's highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white resize-none"
                ></textarea>
              </div>

              {/* Inclusions & Exclusions dynamics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inclusions */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Inclusions</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 5-star Hotel lodging"
                      value={incInput}
                      onChange={(e) => setIncInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddInclusion}
                      className="bg-gray-100 hover:bg-gray-200 px-3 rounded-lg font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {inclusions.map((inc, i) => (
                      <span key={i} className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        {inc}
                        <FiX className="cursor-pointer" onClick={() => setInclusions(inclusions.filter((_, idx) => idx !== i))} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exclusions */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Exclusions</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Flight insurance"
                      value={excInput}
                      onChange={(e) => setExcInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddExclusion}
                      className="bg-gray-100 hover:bg-gray-200 px-3 rounded-lg font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {exclusions.map((exc, i) => (
                      <span key={i} className="bg-rose-50 text-rose-500 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        {exc}
                        <FiX className="cursor-pointer" onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Itinerary Daily breakdown dynamics */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Itinerary Timeline</label>
                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="text-primary font-bold hover:underline"
                  >
                    + Add Day
                  </button>
                </div>
                <div className="flex flex-col gap-3.5 max-h-60 overflow-y-auto pr-2">
                  {itinerary.map((day, idx) => (
                    <div key={idx} className="p-4 border border-gray-100 rounded-xl flex flex-col gap-2.5 bg-gray-50/20 relative">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryDay(idx)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <FiX />
                        </button>
                      )}
                      <span className="font-bold text-primary">Day {day.day}</span>
                      <input
                        type="text"
                        required
                        placeholder="Day Title (e.g. Arrival in Tokyo)"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg"
                      />
                      <textarea
                        required
                        rows="2"
                        placeholder="What will travelers explore today?"
                        value={day.description}
                        onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg resize-none"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured toggle & Image uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <label className="flex items-center gap-2 font-bold cursor-pointer select-none text-gray-800">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-primary w-4.5 h-4.5"
                  />
                  Featured Package (Shows on Homepage)
                </label>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><FiImage /> Upload Gallery Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Form submit */}
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-secondary hover:bg-secondary-hover text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-secondary/10 disabled:opacity-50 mt-4"
              >
                {formSubmitting ? 'Uploading & Processing...' : editingPackageId ? 'Save Package Details' : 'Publish Package Tour'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
