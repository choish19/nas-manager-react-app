import React from 'react';
import { motion } from 'framer-motion';
import { FileType, RecommendationResponse } from '../types';
import { FileCard } from './FileCard';
import { useStore } from '../store/useStore';

interface RecommendationSectionProps {
  recommendation: RecommendationResponse;
  onFileSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  recommendation,
  onFileSelect,
  onToggleBookmark,
}) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  if (!recommendation?.files?.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      <h2 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-gray-100' : 'text-gray-900'
      }`}>
        {recommendation.reason}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendation.files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onSelect={onFileSelect}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendationSection;