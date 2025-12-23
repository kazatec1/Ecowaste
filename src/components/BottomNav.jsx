import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Scan, Link2, Users, Gift, MapPin
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNav = ({ currentPage, onNavigate }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', icon: Home, label: t('dashboard') },
    { id: 'scanner', icon: Scan, label: t('scanner') },
    { id: 'map', icon: MapPin, label: t('map') },
    { id: 'blockchain', icon: Link2, label: t('blockchain') },
    { id: 'social', icon: Users, label: t('social') },
    { id: 'marketplace', icon: Gift, label: t('marketplace') },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-green-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`relative ${isActive ? 'transform -translate-y-1' : ''}`}>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -inset-2 bg-green-100 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={`w-6 h-6 relative z-10 ${isActive ? 'text-green-600' : ''}`} />
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-green-600' : ''}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
