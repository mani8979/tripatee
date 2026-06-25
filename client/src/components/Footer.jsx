import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-gray-400 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-white">
            Trip<span className="text-secondary">atee</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-500">
            Crafting premium, bespoke travel experiences since 2020. Discover curated tour packages, explore luxury destinations, and make lifelong memories.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all shadow"
            >
              <FiFacebook className="text-lg" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-secondary hover:text-white transition-all shadow"
            >
              <FiInstagram className="text-lg" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-sky-500 hover:text-white transition-all shadow"
            >
              <FiTwitter className="text-lg" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-white text-base font-semibold tracking-wide mb-6">Explore</h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li>
              <Link to="/destinations" className="hover:text-primary transition-colors">
                Destinations
              </Link>
            </li>
            <li>
              <Link to="/packages" className="hover:text-primary transition-colors">
                Tour Packages
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-primary transition-colors">
                Travel Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact & Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Destinations Column */}
        <div>
          <h4 className="text-white text-base font-semibold tracking-wide mb-6">Popular Escapes</h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li>
              <Link to="/packages?destination=Paris" className="hover:text-secondary transition-colors">
                Paris, France
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=Tokyo" className="hover:text-secondary transition-colors">
                Tokyo, Japan
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=Maldives" className="hover:text-secondary transition-colors">
                Maldives Lagoon
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=Swiss%20Alps" className="hover:text-secondary transition-colors">
                Swiss Alps Skiing
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=United%20States" className="hover:text-secondary transition-colors">
                United States (USA)
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=Australia" className="hover:text-secondary transition-colors">
                Australia
              </Link>
            </li>
            <li>
              <Link to="/packages?destination=India" className="hover:text-secondary transition-colors">
                Incredible India
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 className="text-white text-base font-semibold tracking-wide mb-6">Get in Touch</h4>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <FiMapPin className="text-secondary text-lg mt-0.5 shrink-0" />
              <span>Tripatee Travels, VIP Road, Visakhapatnam, Andhra Pradesh 530003, India</span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="text-secondary text-lg shrink-0" />
              <span>+91 (800) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="text-secondary text-lg shrink-0" />
              <span>support@tripatee.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>© {currentYear} Tripatee Ltd. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
