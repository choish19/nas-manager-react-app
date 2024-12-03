import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="relative w-full"
    >
      <input
        type="text"
        placeholder="파일 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 hover:bg-gray-700/80' 
            : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-500 hover:bg-white'
        }`}
      />
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`} size={20} />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default SearchBar;