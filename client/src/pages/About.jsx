import React from 'react';
import { FiEye, FiHeart, FiShield, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';

const About = () => {
  const teamMembers = [
    {
      name: 'Elena Rostova',
      role: 'CEO & Founder',
      bio: 'Ex-luxury hotel consultant with 15+ years planning private island escapes.',
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
      bio: 'Bilingual hospitality expert specializing in elite Tokyo cultural encounters.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <div className="flex flex-col gap-6">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest">Our Legacy</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              We Craft Travel Masterpieces
            </h1>
            <p className="text-sm leading-relaxed text-gray-500 font-normal">
              Founded in 2020, Tripatee emerged from a simple realization: travel should not be a transaction, it should be an art form. We reject standardized packages. Instead, we select, inspect, and curates elite global itineraries.
            </p>
            <p className="text-sm leading-relaxed text-gray-500 font-normal">
              Our teams span three continents, working day and night to build local connections. From securing private access to museum galleries to reserving tables at Michelin-starred kitchens, we handle everything.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-lg h-96">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop"
              alt="Luxury Travel Experience"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. CORE VALUES */}
      <section className="py-20 bg-gray-50/70 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col gap-16">
          <div className="flex flex-col items-center gap-2">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest">Core Values</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Operational Philosophy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl">
                <FiShield />
              </div>
              <h3 className="font-bold text-gray-800">Uncompromised Quality</h3>
              <p className="text-xs leading-relaxed text-gray-500">
                Every hotel, chalet, guide, and restaurant is personally vetted and continuously inspected by our agents to guarantee 5-star perfection.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary text-xl">
                <FiHeart />
              </div>
              <h3 className="font-bold text-gray-800">Authentic Connections</h3>
              <p className="text-xs leading-relaxed text-gray-500">
                We design routes that respect local ecosystems, engage local artisans, and create positive, carbon-conscious footprints.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-xl">
                <FiEye />
              </div>
              <h3 className="font-bold text-gray-800">Zero-Friction Travel</h3>
              <p className="text-xs leading-relaxed text-gray-500">
                From private airport transfers to virtual concierge support, we manage the complexities so you can focus entirely on exploration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TEAM SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center flex flex-col gap-12">
          <div className="flex flex-col items-center gap-2">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest">Our Gurus</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Meet the Travel Experts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center"
              >
                <div className="h-72 w-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center flex flex-col gap-2">
                  <h3 className="font-extrabold text-gray-900 text-lg">{member.name}</h3>
                  <span className="text-xs text-primary font-bold">{member.role}</span>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal mt-2">
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
