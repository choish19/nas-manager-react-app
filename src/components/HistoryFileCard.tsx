import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FileCard } from './FileCard';
import { FileType } from '../types';
import { useStore } from '../store/useStore';

interface HistoryFileCardProps {
  file: FileType;
  onSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
  onDeleteHistory: (fileId: number) => void;
}

const HistoryFileCard: React.FC<HistoryFileCardProps> = ({
  file,
  onSelect,
  onToggleBookmark,
  onDeleteHistory,
}) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteHistory(file.id);
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={handleDeleteClick}
          className={`p-2 rounded-full backdrop-blur-sm ${
            isDarkMode
              ? 'bg-gray-800/40 hover:bg-gray-700/60 text-red-400'
              : 'bg-white/90 hover:bg-white text-red-600 shadow-sm'
          } transition-all duration-200 opacity-0 group-hover:opacity-100`}
        >
          <X size={16} />
        </motion.button>
      </div>
      <FileCard
        file={file}
        onSelect={onSelect}
        onToggleBookmark={onToggleBookmark}
      />
    </div>
  );
};

export default HistoryFileCard;