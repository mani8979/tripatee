import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiBriefcase, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Track window scroll to change background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Packages', path: '/packages' },
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav py-4 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-primary font-sans flex items-center">
            Trip<span className="text-secondary">atee</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'text-primary'
                    : isScrolled
                    ? 'text-gray-700 hover:text-primary'
                    : 'text-gray-900 lg:text-white/95 hover:text-primary'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-sm font-semibold px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-full transition-all"
                >
                  <FiGrid /> Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 text-sm font-semibold px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-full transition-all"
                >
                  <FiUser /> My Account
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-red-500 transition-colors"
                title="Log Out"
              >
                <FiLogOut className="text-lg" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className={`text-sm font-semibold transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-primary' : 'text-gray-900 lg:text-white hover:text-primary'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center gap-4">
          {user && (
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="text-gray-700 hover:text-primary transition-colors"
              title="Dashboard"
            >
              <FiUser className="text-xl" />
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-primary transition-colors focus:outline-none"
          >
            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col py-6 px-6 gap-4 z-40 lg:hidden"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-base font-semibold py-2 transition-colors border-b border-gray-50 ${
                    isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {user ? (
              <div className="flex flex-col gap-4 mt-2">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-center font-semibold py-3 rounded-full transition-all"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-center font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <FiLogOut /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-2">
                <Link
                  to="/login"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-center font-semibold py-3 rounded-full transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-primary-hover text-white text-center font-semibold py-3 rounded-full transition-all shadow-md shadow-primary/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
