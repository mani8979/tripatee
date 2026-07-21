import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-gray-300 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {/* Brand Column */}
        <div className="flex flex-col gap-6 text-left">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-white font-display">
            Flashmob<span className="text-secondary ml-1">Travels</span>
          </Link>
          <p className="text-[15px] leading-relaxed text-gray-400">
            Crafting premium, bespoke travel experiences since 2020. Discover curated tour packages, explore luxury destinations, and make lifelong memories.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-transparent transition-all duration-300 shadow-sm"
            >
              <FiFacebook className="text-lg" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-transparent transition-all duration-300 shadow-sm"
            >
              <FiInstagram className="text-lg" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-transparent transition-all duration-300 shadow-sm"
            >
              <FiTwitter className="text-lg" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="text-left">
          <h4 className="text-white text-base font-bold tracking-wide font-display mb-6 uppercase text-xs text-secondary">Explore</h4>
          <ul className="flex flex-col gap-4 text-[15px]">
            <li>
              <Link to="/destinations" className="hover:text-secondary transition-colors duration-200">
                Destinations
              </Link>
            </li>
            <li>
              <Link to="/packages" className="hover:text-secondary transition-colors duration-200">
                Tour Packages
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-secondary transition-colors duration-200">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-secondary transition-colors duration-200">
                Travel Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-secondary transition-colors duration-200">
                Contact & Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Destinations Column */}
        <div className="text-left">
          <h4 className="text-white text-base font-bold tracking-wide font-display mb-6 uppercase text-xs text-secondary">Popular Escapes</h4>
          <ul className="flex flex-col gap-4 text-[15px]">
            <li>
              <Link to="/packages?destination=Paris" className="hover:text-secondary transition-colors duration-200">
                Paris, France
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=Tokyo" className="hover:text-secondary transition-colors duration-200">
                Tokyo, Japan
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=Maldives" className="hover:text-secondary transition-colors duration-200">
                Maldives Lagoon
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=Swiss%20Alps" className="hover:text-secondary transition-colors duration-200">
                Swiss Alps Skiing
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=India" className="hover:text-secondary transition-colors duration-200">
                Incredible India
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="text-left">
          <h4 className="text-white text-base font-bold tracking-wide font-display mb-6 uppercase text-xs text-secondary">Get in Touch</h4>
          <ul className="flex flex-col gap-5 text-[15px]">
            <li className="flex items-start gap-3.5">
              <FiMapPin className="text-secondary text-lg mt-0.5 shrink-0" />
              <span className="text-gray-400">Flashmob Travels, VIP Road, Visakhapatnam, Andhra Pradesh 530003, India</span>
            </li>
            <li className="flex items-center gap-3.5">
              <FiPhone className="text-secondary text-lg shrink-0" />
              <span className="text-gray-400">+91 (800) 123-4567</span>
            </li>
            <li className="flex items-center gap-3.5">
              <FiMail className="text-secondary text-lg shrink-0" />
              <span className="text-gray-400">support@flashmobtravels.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
        <p>© {currentYear} Flashmob Travels Ltd. All rights reserved.</p>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-gray-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-gray-400 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
