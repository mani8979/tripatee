import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.post('/contact', { name, email, subject, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit contact form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header Title */}
        <div className="mb-16 text-left max-w-xl flex flex-col gap-3">
          <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display flex items-center gap-1.5">
            <FiMail className="text-sm" /> Get in touch
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight font-display leading-tight">
            Contact & Support
          </h1>
          <p className="text-sm text-primary/65 leading-relaxed font-light mt-1">
            Have questions about an upcoming departure, private charters, or custom booking alterations? Reach our consultants anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          {/* Left Column: Coordinates */}
          <div className="lg:col-span-1 bg-primary text-white p-10 rounded-[28px] flex flex-col gap-10 text-left relative overflow-hidden shadow-luxury border border-white/5">
            {/* Background design */}
            <div className="absolute w-52 h-52 bg-secondary/5 rounded-full blur-3xl bottom-[-50px] right-[-50px]"></div>

            <div className="flex flex-col gap-2 relative z-10">
              <h3 className="font-extrabold text-xl text-white font-display">Contact Information</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Drop by our offices or contact us through direct lines. Our agents are ready to assist.
              </p>
            </div>

            <div className="flex flex-col gap-8 relative z-10">
              <div className="flex gap-4">
                <FiMapPin className="text-secondary text-2xl shrink-0 mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Headquarters</span>
                  <span className="font-semibold text-white mt-1 leading-relaxed">Flashmob Travels, VIP Road, Visakhapatnam, Andhra Pradesh 530003, India</span>
                </div>
              </div>

              <div className="flex gap-4">
                <FiPhone className="text-secondary text-2xl shrink-0 mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Telephone Lines</span>
                  <span className="font-semibold text-white mt-1 leading-relaxed">+91 (800) 123-4567 (Toll Free)</span>
                  <span className="font-semibold text-white leading-relaxed">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex gap-4">
                <FiMail className="text-secondary text-2xl shrink-0 mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Inquiries</span>
                  <span className="font-semibold text-white mt-1 leading-relaxed">support@flashmobtravels.com</span>
                  <span className="font-semibold text-white leading-relaxed">bookings@flashmobtravels.com</span>
                </div>
              </div>

              <div className="flex gap-4">
                <FiClock className="text-secondary text-2xl shrink-0 mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Consultation Hours</span>
                  <span className="font-semibold text-white mt-1 leading-relaxed">Mon - Fri: 8:00 AM - 8:00 PM</span>
                  <span className="font-semibold text-white leading-relaxed">Sat - Sun: 10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Support Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[28px] border border-primary/5 shadow-luxury text-left flex flex-col justify-between">
            {success ? (
              <div className="py-16 flex flex-col items-center justify-center text-center gap-4 w-full">
                <FiCheckCircle className="text-6xl text-secondary animate-bounce" />
                <h3 className="text-xl font-bold text-primary font-display tracking-tight mt-2">Message Received!</h3>
                <p className="text-sm text-primary/60 max-w-sm font-light">
                  Your inquiry has been submitted successfully. A travel counselor will contact you at your email address within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 shadow-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                <h3 className="font-extrabold text-lg text-primary font-display border-b border-primary/5 pb-3">Send Us a Message</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:border-secondary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:border-secondary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="What is your inquiry regarding?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:border-secondary focus:bg-white transition-all"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-primary/45 uppercase tracking-widest pl-0.5">Message Details</label>
                  <textarea
                    required
                    rows="5"
                    placeholder="Tell us about your requirements, destination preferences, or passenger questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="px-4 py-3.5 bg-gray-50 border border-primary/5 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:border-secondary focus:bg-white resize-none transition-all"
                  ></textarea>
                </div>

                {errorMsg && <p className="text-xs text-red-500 font-bold">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-secondary hover:text-primary text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 font-display mt-2 cursor-pointer"
                >
                  <FiSend /> {submitting ? 'Submitting Message...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. MOCK MAP EMBED */}
        <div className="mt-16 bg-white border border-primary/5 rounded-[28px] p-4 shadow-luxury h-96 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60670.36015525251!2d82.82285193910815!3d18.329158525791244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3a416b23a9d949%3A0x6a54bd246cb402b4!2sAraku%20Valley%2C%20Andhra%20Pradesh%20531149!5e0!3m2!1sen!2sin!4v1719323456789!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '1.25rem' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location Map"
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default Contact;
