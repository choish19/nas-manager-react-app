import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors duration-200"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-5 h-5 text-indigo-600" />
      ) : (
        <Bookmark className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
      )}
    </motion.button>
  );
};