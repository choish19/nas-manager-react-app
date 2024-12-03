import React from 'react';
import { motion } from 'framer-motion';
import { FileIcon } from './FileIcon';
import { useStore } from '../store/useStore';

interface BookmarkCategoriesProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  filesByType: Record<string, any[]>;
}

const BookmarkCategories: React.FC<BookmarkCategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  filesByType,
}) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'video': return 'example.mp4';
      case 'music': return 'example.mp3';
      case 'document': return 'example.docx';
      default: return 'example.txt';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'video': return '비디오';
      case 'music': return '음악';
      case 'document': return '문서';
      case 'all': return '전체';
      default: return category;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const count = category === 'all' 
          ? Object.values(filesByType).flat().length 
          : filesByType[category]?.length || 0;

        return (
          <motion.button
            key={category}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectCategory(category)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              transition-colors duration-200
              ${selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <FileIcon filename={getCategoryIcon(category)} size={18} />
            <span>{getCategoryLabel(category)}</span>
            <span className={`
              px-2 py-0.5 text-xs rounded-full
              ${selectedCategory === category
                ? 'bg-indigo-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-600'
              }
            `}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default BookmarkCategories;