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
    if (e.target.files) {
      setGalleryFiles(Array.from(e.target.files));
    }
  };

  // Form Submit (Create / Edit)
  const handleCreateOrUpdatePackage = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('destination', selectedDest);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('duration', duration);
      formData.append('maxGroupSize', maxGroupSize);
      formData.append('featured', featured ? 'true' : 'false');
      formData.append('inclusions', JSON.stringify(inclusions));
      formData.append('exclusions', JSON.stringify(exclusions));
      formData.append('itinerary', JSON.stringify(itinerary));

      // Append files
      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append('gallery', file);
        });
      }

      if (editingPackageId) {
        await api.put(`/packages/${editingPackageId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/packages', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setShowPackageModal(false);
      loadDashboardData(); // Refresh analytics & packages
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit form data.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setEditingPackageId(null);
    setTitle('');
    if (destinations.length > 0) setSelectedDest(destinations[0]._id);
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
    setShowPackageModal(true);
  };

  const openEditModal = (pkg) => {
    setEditingPackageId(pkg._id);
    setTitle(pkg.title);
    setSelectedDest(pkg.destination?._id || pkg.destination);
    setDescription(pkg.description);
    setPrice(pkg.price);
    setDuration(pkg.duration);
    setMaxGroupSize(pkg.maxGroupSize?.toString() || '10');
    setFeatured(pkg.featured || false);
    setInclusions(pkg.inclusions || []);
    setExclusions(pkg.exclusions || []);
    setItinerary(pkg.itinerary?.length > 0 ? pkg.itinerary : [{ day: 1, title: '', description: '' }]);
    setGalleryFiles([]);
    setFormError('');
    setShowPackageModal(true);
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete tour package.');
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status.');
    }
  };

  const handleBookingPaymentChange = async (bookingId, newPaymentStatus) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/payment`, { paymentStatus: newPaymentStatus });
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to update payment status.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">
        
        {/* Left Side: Sidebar controls */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col gap-8 h-max">
          <div className="flex items-center gap-3.5 border-b border-primary/5 pb-6">
            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-secondary font-black text-base border border-primary/5">
              A
            </div>
            <div>
              <h3 className="font-extrabold text-primary text-sm font-display">Administrator</h3>
              <span className="text-[10px] text-secondary font-black uppercase tracking-wider font-display">Systems Operator</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left font-display cursor-pointer ${
                activeTab === 'analytics' ? 'bg-primary text-white shadow-md' : 'text-primary/60 hover:bg-gray-50'
              }`}
            >
              <FiTrendingUp className="text-base" /> Analytics overview
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left font-display cursor-pointer ${
                activeTab === 'packages' ? 'bg-primary text-white shadow-md' : 'text-primary/60 hover:bg-gray-50'
              }`}
            >
              <FiPackage className="text-base" /> Tour Packages
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left font-display cursor-pointer ${
                activeTab === 'bookings' ? 'bg-primary text-white shadow-md' : 'text-primary/60 hover:bg-gray-50'
              }`}
            >
              <FiBriefcase className="text-base" /> Bookings Control
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left font-display cursor-pointer ${
                activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'text-primary/60 hover:bg-gray-50'
              }`}
            >
              <FiUsers className="text-base" /> Voyager Directory
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-white rounded-[24px] border border-primary/5 shadow-luxury">
              <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* TAB 1: ANALYTICS OVERVIEW */}
              {activeTab === 'analytics' && (
                <div className="flex flex-col gap-8">
                  <h2 className="text-2xl font-black text-primary font-display border-b border-primary/5 pb-4">Systems Analytics</h2>
                  
                  {/* Grid Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[20px] border border-primary/5 shadow-luxury flex items-center gap-4.5">
                      <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary text-xl">
                        <FiTrendingUp />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-primary/45 font-black uppercase tracking-wider">Total Sales (Est)</span>
                        <strong className="text-xl text-primary font-display mt-0.5">₹{metrics?.totalSales?.toLocaleString('en-IN') || '0'}</strong>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-[20px] border border-primary/5 shadow-luxury flex items-center gap-4.5">
                      <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary text-xl">
                        <FiBriefcase />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-primary/45 font-black uppercase tracking-wider">Total Bookings</span>
                        <strong className="text-xl text-primary font-display mt-0.5">{metrics?.totalBookings || '0'}</strong>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-[20px] border border-primary/5 shadow-luxury flex items-center gap-4.5">
                      <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary text-xl">
                        <FiUsers />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-primary/45 font-black uppercase tracking-wider">Registered Voyagers</span>
                        <strong className="text-xl text-primary font-display mt-0.5">{metrics?.totalUsers || '0'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity bookings table */}
                  <div className="flex flex-col gap-4 mt-4">
                    <h3 className="font-bold text-primary font-display text-lg">Recent Booking Inquiries</h3>
                    <div className="bg-white p-6 rounded-[24px] border border-primary/5 shadow-luxury">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-primary/45 uppercase font-bold tracking-widest border-b border-primary/5 font-display text-[9px] pb-3">
                              <th className="pb-3 text-left">Voyager</th>
                              <th className="pb-3 text-left">Selected Tour</th>
                              <th className="pb-3 text-left">Departure Date</th>
                              <th className="pb-3 text-right">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-primary/5 font-medium text-primary/80">
                            {bookings.slice(0, 5).map((b) => (
                              <tr key={b._id}>
                                <td className="py-4 text-left font-bold text-primary">{b.user?.name || 'Guest User'}</td>
                                <td className="py-4 font-bold text-primary/95">{b.package?.title}</td>
                                <td className="py-4 text-primary/60">{new Date(b.bookingDate).toLocaleDateString()}</td>
                                <td className="py-4 text-right font-black text-secondary">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE PACKAGES */}
              {activeTab === 'packages' && (
                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                    <h2 className="text-2xl font-black text-primary font-display">Manage Tour Packages</h2>
                    <button
                      onClick={openCreateModal}
                      className="bg-primary hover:bg-secondary hover:text-primary text-white font-black text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 font-display cursor-pointer"
                    >
                      <FiPlus className="text-sm" /> Create Tour
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packages.map((pkg) => (
                      <div
                        key={pkg._id}
                        className="bg-white p-6 rounded-[20px] border border-primary/5 shadow-luxury flex justify-between gap-4 items-start"
                      >
                        <div className="flex gap-4 text-left">
                          <img
                            src={pkg.gallery?.[0]}
                            alt="Tour"
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-primary/5"
                          />
                          <div className="flex flex-col gap-1">
                            <h4 className="font-extrabold text-primary text-sm leading-tight line-clamp-1 font-display">{pkg.title}</h4>
                            <span className="text-[10px] text-secondary font-black uppercase tracking-wider font-display">
                              {pkg.destination?.name}
                            </span>
                            <span className="text-[11px] font-black text-primary mt-1">₹{pkg.price?.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(pkg)}
                            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-secondary hover:text-primary text-primary/60 border border-primary/5 flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit Tour"
                          >
                            <FiEdit2 className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg._id)}
                            className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Tour"
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
                <div className="flex flex-col gap-8">
                  <h2 className="text-2xl font-black text-primary font-display border-b border-primary/5 pb-4">Customer Bookings</h2>
                  
                  <div className="bg-white p-6 md:p-8 rounded-[24px] border border-primary/5 shadow-luxury">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-primary/45 uppercase font-bold tracking-widest border-b border-primary/5 pb-3 font-display text-[9px]">
                            <th className="pb-3 text-left">Voyager Details</th>
                            <th className="pb-3 text-left">Tour Package</th>
                            <th className="pb-3 text-left">Departure Date</th>
                            <th className="pb-3 text-left">Payment</th>
                            <th className="pb-3 text-left">Order Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5 font-medium text-primary/80">
                          {bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td className="py-4 text-left">
                                <p className="text-primary font-bold">{booking.user?.name || 'Guest User'}</p>
                                <p className="text-[10px] text-primary/40 mt-0.5">{booking.user?.email || 'N/A'}</p>
                              </td>
                              <td className="py-4 text-primary font-bold leading-tight">{booking.package?.title}</td>
                              <td className="py-4 text-primary/60">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                              
                              {/* Payment status edit drop down */}
                              <td className="py-4">
                                <div className="bg-gray-50 border border-primary/5 rounded-lg px-1.5 py-1 w-max">
                                  <select
                                    value={booking.paymentStatus}
                                    onChange={(e) => handleBookingPaymentChange(booking._id, e.target.value)}
                                    className="bg-transparent border-none outline-none text-[10px] font-bold text-primary focus:ring-0 cursor-pointer"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="refunded">Refunded</option>
                                  </select>
                                </div>
                              </td>

                              {/* Order Status edit drop down */}
                              <td className="py-4">
                                <div className="bg-gray-50 border border-primary/5 rounded-lg px-1.5 py-1 w-max">
                                  <select
                                    value={booking.status}
                                    onChange={(e) => handleBookingStatusChange(booking._id, e.target.value)}
                                    className="bg-transparent border-none outline-none text-[10px] font-bold text-primary focus:ring-0 cursor-pointer"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
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
                <div className="flex flex-col gap-8">
                  <h2 className="text-2xl font-black text-primary font-display border-b border-primary/5 pb-4">Voyager Directory</h2>
                  
                  <div className="bg-white p-6 md:p-8 rounded-[24px] border border-primary/5 shadow-luxury">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-primary/45 uppercase font-bold tracking-widest border-b border-primary/5 pb-3 font-display text-[9px]">
                            <th className="pb-3 text-left">Name</th>
                            <th className="pb-3 text-left">Email Address</th>
                            <th className="pb-3 text-left">Role Position</th>
                            <th className="pb-3 text-left">Verification State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5 font-medium text-primary/80">
                          {users.map((u) => (
                            <tr key={u._id}>
                              <td className="py-4 text-primary font-bold text-left">{u.name}</td>
                              <td className="py-4 text-primary/60 text-left">{u.email}</td>
                              <td className="py-4 text-left">
                                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider font-display ${
                                  u.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/15' : 'bg-gray-100 text-primary/65 border border-gray-200'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-4 text-left">
                                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider font-display ${
                                  u.isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
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
            </>
          )}
        </div>
      </div>

      {/* CREATE / EDIT TOUR PACKAGE MODAL */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-primary/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 sm:p-10 relative text-left shadow-2xl border border-primary/5">
            <button
              onClick={() => setShowPackageModal(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-50 border border-primary/5 flex items-center justify-center hover:scale-105 transition-all text-primary/60 cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>

            <h3 className="text-2xl font-black text-primary font-display mb-6 border-b border-primary/5 pb-3">
              {editingPackageId ? 'Edit Tour Package' : 'Publish Tour Package'}
            </h3>

            {formError && <p className="text-xs text-red-600 font-bold bg-red-50 border border-red-100 p-4 rounded-xl mb-6">{formError}</p>}

            <form onSubmit={handleCreateOrUpdatePackage} className="flex flex-col gap-5 text-xs text-primary/70 font-semibold">
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Tour Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Grand Voyage to Kyoto"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-primary font-semibold focus:outline-none focus:border-secondary focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Destination</label>
                  <div className="bg-gray-50 border border-primary/5 rounded-xl px-2 py-0.5">
                    <select
                      value={selectedDest}
                      onChange={(e) => setSelectedDest(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-primary font-semibold w-full py-2.5 cursor-pointer focus:ring-0"
                    >
                      {destinations.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}, {d.country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Price (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="99999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-primary font-semibold focus:outline-none focus:border-secondary focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Duration Description</label>
                  <input
                    type="text"
                    required
                    placeholder="5 Days / 4 Nights"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-primary font-semibold focus:outline-none focus:border-secondary focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Max Group Size</label>
                  <input
                    type="number"
                    required
                    placeholder="12"
                    value={maxGroupSize}
                    onChange={(e) => setMaxGroupSize(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-primary font-semibold focus:outline-none focus:border-secondary focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Tour Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Detail the package's highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-primary font-semibold focus:outline-none focus:border-secondary focus:bg-white resize-none"
                ></textarea>
              </div>

              {/* Inclusions & Exclusions dynamics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inclusions */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Inclusions</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 5-star Hotel lodging"
                      value={incInput}
                      onChange={(e) => setIncInput(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold text-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddInclusion}
                      className="bg-primary hover:bg-secondary hover:text-primary text-white px-4 rounded-xl text-[10px] uppercase font-black font-display cursor-pointer transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {inclusions.map((inc, i) => (
                      <span key={i} className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-3 py-1 rounded-md flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-display">
                        {inc}
                        <FiX className="cursor-pointer text-xs" onClick={() => setInclusions(inclusions.filter((_, idx) => idx !== i))} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exclusions */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Exclusions</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Flight insurance"
                      value={excInput}
                      onChange={(e) => setExcInput(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold text-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddExclusion}
                      className="bg-primary hover:bg-secondary hover:text-primary text-white px-4 rounded-xl text-[10px] uppercase font-black font-display cursor-pointer transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exclusions.map((exc, i) => (
                      <span key={i} className="bg-rose-50 text-rose-500 border border-rose-100 font-bold px-3 py-1 rounded-md flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-display">
                        {exc}
                        <FiX className="cursor-pointer text-xs" onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Itinerary Daily breakdown dynamics */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Itinerary Timeline</label>
                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="text-secondary font-black hover:text-primary text-xs uppercase tracking-wider font-display cursor-pointer"
                  >
                    + Add Day
                  </button>
                </div>
                <div className="flex flex-col gap-3.5 max-h-60 overflow-y-auto pr-2">
                  {itinerary.map((day, idx) => (
                    <div key={idx} className="p-5 border border-primary/5 rounded-2xl flex flex-col gap-3 bg-gray-50/20 relative text-left">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryDay(idx)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <FiX className="text-base" />
                        </button>
                      )}
                      <span className="font-extrabold text-primary font-display uppercase tracking-wider text-[10px]">Day {day.day} details</span>
                      <input
                        type="text"
                        required
                        placeholder="Day Title (e.g. Arrival in Tokyo)"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                        className="px-4 py-2.5 bg-white border border-primary/5 rounded-xl text-primary font-semibold text-xs"
                      />
                      <textarea
                        required
                        rows="2"
                        placeholder="What will travelers explore today?"
                        value={day.description}
                        onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)}
                        className="px-4 py-2.5 bg-white border border-primary/5 rounded-xl text-primary font-semibold text-xs resize-none"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured toggle & Image uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-t border-primary/5 pt-5 mt-2">
                <label className="flex items-center gap-2.5 font-bold cursor-pointer select-none text-primary">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-secondary w-4.5 h-4.5"
                  />
                  <span>Featured Package (Shows on Homepage)</span>
                </label>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
                    <FiImage className="text-secondary" /> Upload Gallery Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs text-primary/60 font-semibold"
                  />
                </div>
              </div>

              {/* Form submit */}
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 mt-4 font-display cursor-pointer"
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
