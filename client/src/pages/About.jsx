import React from 'react';
import { FiEye, FiHeart, FiShield, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';

const About = () => {
  const teamMembers = [
    {
      name: 'Elena Rostova',
      role: 'CEO & Founder',
      bio: 'Ex-luxury hospitality consultant with 15+ years planning private island escapes.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop',
    },
    {
      name: 'Marcus Vance',
      role: 'Head of Curated Operations',
      bio: 'Former expedition leader who has traveled to over 110 countries.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop',
    },
    {
      name: 'Yuki Tanaka',
      role: 'Lead Concierge Specialist',
      bio: 'Bilingual hospitality expert specializing in elite cultural encounters.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-warm-white">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
          <div className="flex flex-col gap-6">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display">Our Legacy</span>
            <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight font-display leading-[1.15]">
              We Craft Travel Masterpieces
            </h1>
            <p className="text-[14.5px] leading-relaxed text-primary/65 font-light">
              Founded in 2020, Flashmob Travels emerged from a simple realization: travel should not be a transaction, it should be an art form. We reject standardized packages. Instead, we select, inspect, and curate elite global itineraries.
            </p>
            <p className="text-[14.5px] leading-relaxed text-primary/65 font-light">
              Our teams span three continents, working day and night to build local connections. From securing private access to museum galleries to reserving tables at Michelin-starred kitchens, we handle everything.
            </p>
          </div>
          <div className="relative rounded-[28px] overflow-hidden shadow-luxury h-[440px] border border-primary/5">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop"
              alt="Luxury Travel Experience"
              className="w-full h-full object-cover brightness-95 scale-100 hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* 2. CORE VALUES */}
      <section className="py-24 bg-white border-t border-b border-primary/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center flex flex-col gap-16">
          <div className="flex flex-col items-center gap-3">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display">Core Values</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight font-display">Our Operational Philosophy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="bg-white p-10 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col gap-5 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-xl shrink-0">
                <FiShield />
              </div>
              <h3 className="font-bold text-primary text-lg font-display">Uncompromised Quality</h3>
              <p className="text-xs leading-relaxed text-primary/60 font-medium">
                Every hotel, chalet, guide, and restaurant is personally vetted and continuously inspected by our agents to guarantee 5-star perfection.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col gap-5 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-xl shrink-0">
                <FiHeart />
              </div>
              <h3 className="font-bold text-primary text-lg font-display">Authentic Connections</h3>
              <p className="text-xs leading-relaxed text-primary/60 font-medium">
                We design routes that respect local ecosystems, engage local artisans, and create positive, carbon-conscious footprints.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[24px] border border-primary/5 shadow-luxury flex flex-col gap-5 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-xl shrink-0">
                <FiEye />
              </div>
              <h3 className="font-bold text-primary text-lg font-display">Zero-Friction Travel</h3>
              <p className="text-xs leading-relaxed text-primary/60 font-medium">
                From private airport transfers to virtual concierge support, we manage the complexities so you can focus entirely on exploration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TEAM SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 text-center">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col items-center gap-3">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.2em] font-display">Our Gurus</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight font-display">Meet the Travel Experts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-[24px] overflow-hidden border border-primary/5 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="h-80 w-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col gap-2.5">
                  <h3 className="font-extrabold text-primary text-lg font-display">{member.name}</h3>
                  <span className="text-xs text-secondary font-black uppercase tracking-wider font-display">{member.role}</span>
                  <p className="text-xs text-primary/60 leading-relaxed font-light mt-1.5 font-sans">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
