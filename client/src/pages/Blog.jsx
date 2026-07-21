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
    <div className="min-h-screen pt-32 pb-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
          <div className="flex flex-col gap-3 max-w-xl">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display flex items-center gap-1.5">
              <FiTag className="text-sm" /> Travel Gazette
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight font-display leading-tight">
              Stories & Travel Guides
            </h1>
            <p className="text-sm text-primary/60 leading-relaxed font-light mt-1">
              Get inspired by travel tips, destination breakdowns, and packing guides written directly by our professional globetrotters.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-primary/5 shadow-luxury w-full md:max-w-md shrink-0">
            <FiSearch className="text-secondary text-lg shrink-0" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full font-semibold text-primary placeholder-primary/30"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
              className={`px-7 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer font-display border ${
                (cat === 'All' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-primary border-primary text-white shadow-md'
                  : 'bg-white border-primary/5 text-primary/60 hover:text-secondary hover:border-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[24px] border border-primary/5 shadow-luxury max-w-lg mx-auto">
            <FiTag className="text-4xl text-primary/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-primary font-display">No Articles Found</h3>
            <p className="text-xs text-primary/50 mt-1">No articles found matching your parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setActiveBlog(blog)}
                className="bg-white rounded-[24px] overflow-hidden border border-primary/5 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group cursor-pointer flex flex-col h-[480px]"
              >
                <div className="h-56 overflow-hidden shrink-0">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                  />
                </div>
                
                <div className="p-8 flex flex-col justify-between flex-1">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3.5 py-1 rounded-md w-max font-display">
                      {blog.category}
                    </span>
                    <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug font-display">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-primary/60 line-clamp-3 leading-relaxed font-light font-sans">
                      {blog.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-primary/5 pt-5 text-[11px] text-primary/40 font-semibold mt-4">
                    <span className="flex items-center gap-1.5"><FiUser className="text-secondary text-sm" /> By {blog.author?.name}</span>
                    <span className="flex items-center gap-1.5"><FiCalendar className="text-secondary text-sm" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
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
            className="fixed inset-0 bg-primary/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[28px] w-full max-w-3xl max-h-[85vh] overflow-y-auto relative shadow-2xl text-left border border-primary/5"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveBlog(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/95 border border-primary/5 flex items-center justify-center shadow hover:scale-105 transition-all text-primary/70 z-10 focus:outline-none cursor-pointer"
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
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent"></div>
                <div className="absolute bottom-6 left-8 right-8 text-white">
                  <span className="bg-secondary text-primary text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-md shadow font-display">
                    {activeBlog.category}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black mt-4 leading-tight tracking-tight font-display">
                    {activeBlog.title}
                  </h2>
                </div>
              </div>

              {/* Blog Metadata & Content Body */}
              <div className="p-8 sm:p-10">
                <div className="flex flex-wrap gap-5 text-xs text-primary/45 font-bold uppercase tracking-wider border-b border-primary/5 pb-5 mb-6">
                  <span>Author: <strong className="text-primary font-black font-display">{activeBlog.author?.name}</strong></span>
                  <span>Published: <strong className="text-primary font-black font-display">{new Date(activeBlog.createdAt).toLocaleDateString()}</strong></span>
                  <span>Read Time: <strong className="text-primary font-black font-display">{activeBlog.readTime || '5 mins'}</strong></span>
                </div>

                <div className="text-[14.5px] leading-relaxed text-primary/65 font-light font-sans whitespace-pre-line flex flex-col gap-4">
                  {activeBlog.content}
                </div>

                {activeBlog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-primary/5">
                    {activeBlog.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-wider text-primary/50 bg-primary/5 px-4 py-1.5 rounded-full">
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
