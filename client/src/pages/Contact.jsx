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
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Title */}
        <div className="mb-12 text-left max-w-xl flex flex-col gap-2">
          <span className="text-primary text-xs font-extrabold uppercase tracking-widest flex items-center gap-1">
            <FiMail /> Get in touch
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mt-1">
            Contact & Support
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Have questions about an upcoming departure, private charters, or custom booking alterations? Reach our consultants anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          {/* Left Column: Coordinates */}
          <div className="lg:col-span-1 bg-dark text-white p-8 rounded-3xl flex flex-col gap-10 text-left relative overflow-hidden shadow-xl">
            {/* Background design */}
            <div className="absolute w-52 h-52 bg-primary/10 rounded-full blur-3xl bottom-[-50px] right-[-50px]"></div>

            <div className="flex flex-col gap-2 relative z-10">
              <h3 className="font-extrabold text-xl text-white">Contact Information</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Drop by our offices or contact us through direct lines. Our agents are ready to assist.
              </p>
            </div>

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex gap-4">
                <FiMapPin className="text-secondary text-2xl shrink-0 mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span className="text-gray-400 font-medium">Headquarters</span>
                  <span className="font-semibold text-white mt-1">100 Luxury Avenue, Suite 500, New York, NY 10001</span>
                </div>
              </div>

              <div className="flex gap-4">
                <FiPhone className="text-secondary text-2xl shrink-0 mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span className="text-gray-400 font-medium">Telephone Lines</span>
                  <span className="font-semibold text-white mt-1">+1 (800) 123-4567</span>
                  <span className="font-semibold text-white">+1 (800) 765-4321</span>
                </div>
              </div>

              <div className="flex gap-4">
                <FiMail className="text-secondary text-2xl shrink-0 mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span className="text-gray-400 font-medium">Email Inquiries</span>
                  <span className="font-semibold text-white mt-1">support@tripatee.com</span>
                  <span className="font-semibold text-white">bookings@tripatee.com</span>
                </div>
              </div>

              <div className="flex gap-4">
                <FiClock className="text-secondary text-2xl shrink-0 mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span className="text-gray-400 font-medium">Consultation Hours</span>
                  <span className="font-semibold text-white mt-1">Mon - Fri: 8:00 AM - 8:00 PM</span>
                  <span className="font-semibold text-white">Sat - Sun: 10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Support Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm text-left flex flex-col justify-between">
            {success ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                <FiCheckCircle className="text-6xl text-secondary animate-bounce" />
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Message Received!</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Your inquiry has been submitted successfully. A travel counselor will contact you at your email address within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3 rounded-full transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <h3 className="font-extrabold text-lg text-gray-900">Send Us a Message</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
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

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="What is your inquiry regarding?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Message Details</label>
                  <textarea
                    required
                    rows="5"
                    placeholder="Tell us about your requirements, destination preferences, or passenger questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white resize-none"
                  ></textarea>
                </div>

                {errorMsg && <p className="text-xs text-red-500 font-bold">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-4 rounded-xl transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiSend /> {submitting ? 'Submitting Message...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. MOCK MAP EMBED */}
        <div className="mt-16 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm h-96 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.4283824364405!2d-73.98731968459384!3d40.75122497932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1655978438183!5m2!1sen!2sus"
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
