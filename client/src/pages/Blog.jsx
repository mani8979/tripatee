import React, { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiUser, FiX, FiTag } from 'react-icons/fi';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Active reading modal state
  const [activeBlog, setActiveBlog] = useState(null);

  const categories = ['All', 'Travel Tips', 'Luxury', 'Adventure'];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }
        const res = await api.get(`/blogs?${queryParams.toString()}`);
        setBlogs(res.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest flex items-center gap-1">
              <FiTag /> Travel Gazette
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Stories & Travel Guides
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mt-1">
              Get inspired by travel tips, destination breakdowns, and packing guides written directly by our professional globetrotters.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-gray-200 shadow-sm w-full md:max-w-md shrink-0">
            <FiSearch className="text-primary text-lg shrink-0" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full font-medium text-gray-700"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                (cat === 'All' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/15'
                  : 'bg-white text-gray-500 hover:text-primary hover:border-primary border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto">
            <FiTag className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No Articles Found</h3>
            <p className="text-sm text-gray-500 mt-1">No articles found matching your parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setActiveBlog(blog)}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer flex flex-col h-[460px]"
              >
                <div className="h-52 overflow-hidden shrink-0">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary bg-secondary/5 px-2.5 py-1 rounded-full w-max">
                      {blog.category}
                    </span>
                    <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {blog.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 text-[10px] text-gray-400 font-semibold mt-4">
                    <span className="flex items-center gap-1"><FiUser /> By {blog.author?.name}</span>
                    <span className="flex items-center gap-1"><FiCalendar /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* RICH READER MODAL OVERLAY */}
      <AnimatePresence>
        {activeBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto relative shadow-2xl text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveBlog(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 border border-gray-100 flex items-center justify-center shadow hover:scale-105 transition-all text-gray-700 z-10 focus:outline-none"
              >
                <FiX className="text-lg" />
              </button>

              {/* Cover Banner */}
              <div className="h-64 sm:h-80 w-full relative">
                <img
                  src={activeBlog.image}
                  alt={activeBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="bg-secondary text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    {activeBlog.category}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-extrabold mt-3 leading-snug tracking-tight">
                    {activeBlog.title}
                  </h2>
                </div>
              </div>

              {/* Blog Metadata & Content Body */}
              <div className="p-8">
                <div className="flex gap-6 text-xs text-gray-400 font-semibold border-b border-gray-100 pb-4 mb-6">
                  <span>Author: <strong className="text-gray-700 font-bold">{activeBlog.author?.name}</strong></span>
                  <span>Published: <strong className="text-gray-700 font-bold">{new Date(activeBlog.createdAt).toLocaleDateString()}</strong></span>
                  <span>Read Time: <strong className="text-gray-700 font-bold">{activeBlog.readTime}</strong></span>
                </div>

                <div className="text-sm leading-relaxed text-gray-600 font-normal whitespace-pre-line flex flex-col gap-4">
                  {activeBlog.content}
                </div>

                {activeBlog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
                    {activeBlog.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Blog;
