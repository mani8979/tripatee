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

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-nav py-4 shadow-luxury'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className={`text-2xl font-extrabold tracking-tight font-display transition-colors duration-300 ${
            !isScrolled && isHome ? 'text-white' : 'text-primary'
          }`}>
            Flashmob<span className="text-secondary ml-1 group-hover:brightness-110 transition-all">Travels</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-[15px] font-medium tracking-wide transition-colors duration-300 nav-link-underline py-1.5 ${
                  isActive
                    ? 'text-secondary font-semibold'
                    : !isScrolled && isHome
                    ? 'text-white/90 hover:text-secondary'
                    : 'text-primary/80 hover:text-secondary'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-5">
              {user.role === 'admin' ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 bg-primary text-white border border-transparent hover:bg-primary-hover hover:border-secondary hover:text-secondary rounded-full transition-all duration-300 shadow-sm"
                >
                  <FiGrid className="text-base" /> Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 bg-primary text-white border border-transparent hover:bg-primary-hover hover:border-secondary hover:text-secondary rounded-full transition-all duration-300 shadow-sm"
                >
                  <FiUser className="text-base" /> My Account
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${
                  !isScrolled && isHome 
                    ? 'border-white/20 text-white/80 hover:bg-white/10 hover:text-secondary' 
                    : 'border-primary/10 text-primary/70 hover:bg-primary/5 hover:text-red-500'
                }`}
                title="Log Out"
              >
                <FiLogOut className="text-lg" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className={`text-[15px] font-semibold transition-colors duration-300 hover:text-secondary ${
                  !isScrolled && isHome ? 'text-white/95' : 'text-primary/95'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold px-7 py-3 rounded-full transition-all duration-300 shadow-md shadow-primary/10 border border-transparent hover:border-secondary hover:text-secondary"
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
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                !isScrolled && isHome 
                  ? 'border-white/20 text-white' 
                  : 'border-primary/10 text-primary'
              }`}
              title="Dashboard"
            >
              <FiUser className="text-lg" />
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 focus:outline-none ${
              !isScrolled && isHome 
                ? 'border-white/20 text-white hover:bg-white/10' 
                : 'border-primary/10 text-primary hover:bg-primary/5'
            }`}
          >
            {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col py-6 px-6 gap-3 z-40 lg:hidden"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-base font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                    isActive ? 'text-secondary bg-primary/5' : 'text-primary hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {user ? (
              <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-100">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="bg-primary hover:bg-primary-hover text-white text-center font-semibold py-3.5 rounded-full transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-center font-semibold py-3.5 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <FiLogOut /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-100">
                <Link
                  to="/login"
                  className="bg-gray-100 hover:bg-gray-200 text-primary text-center font-semibold py-3.5 rounded-full transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-primary-hover text-white text-center font-semibold py-3.5 rounded-full transition-all shadow-md shadow-primary/20"
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
