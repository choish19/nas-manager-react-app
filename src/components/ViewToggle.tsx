import React from 'react';
import { Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  return (
    <div className={`rounded-lg shadow-sm p-1 flex gap-1 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded transition-colors duration-200 ${
          view === 'grid'
            ? isDarkMode
              ? 'bg-indigo-500/20 text-indigo-400'
              : 'bg-indigo-50 text-indigo-600'
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/60'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Grid size={20} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('list')}
        className={`p-2 rounded transition-colors duration-200 ${
          view === 'list'
            ? isDarkMode
              ? 'bg-indigo-500/20 text-indigo-400'
              : 'bg-indigo-50 text-indigo-600'
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/60'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
      >
        <List size={20} />
      </motion.button>
    </div>
  );
};