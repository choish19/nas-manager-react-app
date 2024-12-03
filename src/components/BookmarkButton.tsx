import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onClick }) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  return (
    <motion.button
      onClick={onClick}
      className={`p-2 rounded-full backdrop-blur-sm ${
        isDarkMode 
          ? isBookmarked
            ? 'bg-indigo-500/20 hover:bg-indigo-500/30'
            : 'bg-gray-800/40 hover:bg-gray-700/60'
          : 'bg-white/90 hover:bg-white shadow-sm'
      } transition-colors duration-200`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isBookmarked ? (
        <BookmarkCheck className={`w-5 h-5 ${
          isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
        }`} />
      ) : (
        <Bookmark className={`w-5 h-5 ${
          isDarkMode 
            ? 'text-gray-400 hover:text-gray-300' 
            : 'text-gray-400 hover:text-gray-600'
        }`} />
      )}
    </motion.button>
  );
};