import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiActivity, FiPlayCircle, FiBookOpen, FiCalendar, FiTrendingUp, FiCompass, FiClock, FiCheckSquare, FiYoutube } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';

export default function FloatingNav() {
  const { userStats } = useContext(AppContext);

  const links = [
    { to: '/', icon: <FiGrid className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/sport', icon: <FiActivity className="w-5 h-5" />, label: 'Fitness' },
    { to: '/entertainment', icon: <FiPlayCircle className="w-5 h-5" />, label: 'Play' },
    { to: '/learning', icon: <FiBookOpen className="w-5 h-5" />, label: 'Learn' },
    { to: '/habits', icon: <FiCompass className="w-5 h-5" />, label: 'Habits' },
    { to: '/youtube', icon: <FiYoutube className="w-5 h-5" />, label: 'YouTube' },
    { to: '/rituals', icon: <FiCheckSquare className="w-5 h-5" />, label: 'Rituals' },
    { to: '/history', icon: <FiClock className="w-5 h-5" />, label: 'History' },
    { to: '/calendar', icon: <FiCalendar className="w-5 h-5" />, label: 'Calendar' },
    { to: '/analytics', icon: <FiTrendingUp className="w-5 h-5" />, label: 'Stats' }
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="glass rounded-full px-6 py-3 flex items-center justify-between gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-white/10 relative"
      >
        {/* Neon Glow underlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 rounded-full blur-md" />

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `relative p-2.5 rounded-full transition-all duration-300 group flex flex-col items-center cursor-pointer ${
                isActive ? 'text-primary' : 'text-white/60 hover:text-white hover:scale-105'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-white/5 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,213,74,0.15)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{link.icon}</span>
                
                {/* Floating labels on hover */}
                <span className="absolute bottom-14 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-lg text-[10px] font-space font-medium tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none uppercase whitespace-nowrap border-white/5">
                  {link.label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* Level Indicator Mini-Badge */}
        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center font-space text-xs font-bold text-[#0B1220] shadow-[0_0_10px_rgba(255,213,74,0.3)] ml-2 border border-white/10 select-none">
          Lvl {userStats.level}
        </div>
      </motion.nav>
    </div>
  );
}
