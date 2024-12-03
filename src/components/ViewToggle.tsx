import React from 'react';
import { Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-1 flex gap-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded ${
          view === 'grid'
            ? 'bg-indigo-50 text-indigo-600'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Grid size={20} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('list')}
        className={`p-2 rounded ${
          view === 'list'
            ? 'bg-indigo-50 text-indigo-600'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <List size={20} />
      </motion.button>
    </div>
  );
};