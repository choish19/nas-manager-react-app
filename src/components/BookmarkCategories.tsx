import React from 'react';
import { motion } from 'framer-motion';
import { FileType } from '../types';
import { Film, Music, FileText, Bookmark } from 'lucide-react';

interface BookmarkCategoriesProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  filesByType: Record<string, FileType[]>;
}

const BookmarkCategories: React.FC<BookmarkCategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  filesByType,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video':
        return Film;
      case 'music':
        return Music;
      case 'document':
        return FileText;
      default:
        return Bookmark;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'video':
        return '비디오';
      case 'music':
        return '음악';
      case 'document':
        return '문서';
      case 'all':
        return '전체';
      default:
        return category;
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category);
        const count = category === 'all' 
          ? Object.values(filesByType).flat().length 
          : filesByType[category]?.length || 0;

        return (
          <motion.button
            key={category}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(category)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
              ${selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Icon size={18} />
            <span>{getCategoryLabel(category)}</span>
            <span className={`
              px-2 py-0.5 text-xs rounded-full
              ${selectedCategory === category
                ? 'bg-indigo-500 text-white'
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