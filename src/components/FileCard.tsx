import React from 'react';
import { motion } from 'framer-motion';
import { FileIcon } from './FileIcon';
import { BookmarkButton } from './BookmarkButton';
import { formatDate } from '../utils/dateUtils';
import { FileType } from '../types';
import { useStore } from '../store/useStore';

interface FileCardProps {
  file: FileType;
  onSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onSelect, onToggleBookmark }) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  return (
    <motion.div
      className={`rounded-xl overflow-hidden cursor-pointer group ${
        isDarkMode 
          ? 'bg-gray-800/80 hover:bg-gray-700/60' 
          : 'bg-white hover:bg-gray-50'
      } transition-all duration-200`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(file)}
    >
      <div className={`relative aspect-video p-6 flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900/40' : 'bg-gray-50'
      }`}>
        <div className="transform transition-transform duration-300 group-hover:scale-110">
          <FileIcon 
            filename={file.name}
            size={48}
          />
        </div>
        <div className="absolute top-2 right-2 z-10">
          <BookmarkButton
            isBookmarked={file.bookmarked}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(file.id);
            }}
          />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`font-medium truncate mb-1 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-900'
        }`}>
          {file.name}
        </h3>
        <div className="space-y-1">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            최근 접근: {formatDate(file.lastAccessed)}
          </p>
          {file.watchedAt && (
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              시청 일시: {formatDate(file.watchedAt)}
            </p>
          )}
          {file.tags && file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {file.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                    isDarkMode 
                      ? 'bg-indigo-900/30 text-indigo-300' 
                      : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};