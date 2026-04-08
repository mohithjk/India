import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Sparkles } from 'lucide-react';
import karnatakaDistricts from '../data/karnatakaDistricts';

const regionColors = {
  'North Karnataka': { accent: '#FF6B35', glow: 'rgba(255, 107, 53, 0.3)' },
  'South Karnataka': { accent: '#00C9A7', glow: 'rgba(0, 201, 167, 0.3)' },
  'Central Karnataka': { accent: '#845EC2', glow: 'rgba(132, 94, 194, 0.3)' },
  'Coastal Karnataka': { accent: '#0081CF', glow: 'rgba(0, 129, 207, 0.3)' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const DistrictView = ({ stateName, onSelectDistrict, onBack }) => {
  return (
    <div className="min-h-screen bg-[#020202] relative overflow-hidden selection:bg-orange-500/30">
      {/* Background aura effects */}
      <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] bg-orange-600/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-600/3 blur-[150px] rounded-full pointer-events-none" />

      {/* Noise overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Header */}
      <header className="relative z-30 w-full px-6 md:px-12 pt-8 pb-4">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center space-x-2 text-white/60 hover:text-white transition-all glass-panel px-5 py-2.5 rounded-full uppercase tracking-widest text-xs font-bold active:scale-95 mb-8"
        >
          <ArrowLeft size={14} />
          <span>Back to Map</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-4"
        >
          <p className="text-orange-400/70 text-xs font-bold tracking-[0.5em] uppercase mb-3">
            Explore the Districts of
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white shimmer-glow uppercase leading-none">
            {stateName}
          </h1>
          <p className="mt-4 text-gray-500 text-sm md:text-base max-w-xl mx-auto font-light">
            Select a district to begin a cinematic journey through its landscapes, cuisine, and culture.
          </p>
        </motion.div>

        {/* Region Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mt-6 mb-2"
        >
          {Object.entries(regionColors).map(([region, { accent }]) => (
            <div key={region} className="flex items-center gap-2 text-xs text-gray-400">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: accent }}
              />
              {region}
            </div>
          ))}
        </motion.div>
      </header>

      {/* District Grid */}
      <main className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {karnatakaDistricts.map((district) => {
            const colors = regionColors[district.region] || regionColors['South Karnataka'];
            return (
              <motion.button
                key={district.name}
                variants={cardVariants}
                onClick={() => onSelectDistrict(district.name)}
                className="district-card group relative flex flex-col items-center justify-center p-5 md:p-6 rounded-2xl text-center cursor-pointer transition-all duration-300 border border-white/[0.06] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06]"
                style={{
                  '--card-glow': colors.glow,
                  '--card-accent': colors.accent,
                }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 30px ${colors.glow}, 0 0 40px ${colors.glow}`,
                  }}
                />

                {/* Icon */}
                <MapPin
                  size={16}
                  className="mb-2 text-gray-600 group-hover:text-white/80 transition-colors duration-300"
                  style={{ color: undefined }}
                />

                {/* District Name */}
                <span className="text-sm md:text-base font-semibold text-white/80 group-hover:text-white transition-colors duration-300 leading-tight">
                  {district.name}
                </span>

                {/* Alt Name */}
                {district.altName && (
                  <span className="text-[10px] text-gray-500 group-hover:text-gray-300 mt-1 transition-colors duration-300">
                    ({district.altName})
                  </span>
                )}

                {/* Tag badge */}
                {district.tag && (
                  <span
                    className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${colors.accent}20`,
                      color: colors.accent,
                    }}
                  >
                    <Sparkles size={8} />
                    {district.tag}
                  </span>
                )}

                {/* Region dot */}
                <span
                  className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: colors.accent }}
                />
              </motion.button>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
};

export default DistrictView;
