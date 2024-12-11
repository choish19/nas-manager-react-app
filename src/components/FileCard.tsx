import React from 'react';
import { motion } from 'framer-motion';
import { FileIcon } from './FileIcon';
import { BookmarkButton } from './BookmarkButton';
import { formatDate } from '../utils/dateUtils';
import { FileType } from '../types';
import { useStore } from '../store/useStore';
import { Eye, Clock } from 'lucide-react';
import { formatViewCount, getParentFolder } from '../utils/fileUtils';

interface FileCardProps {
  file: FileType;
  onSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onSelect, onToggleBookmark }) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;
  const parentFolder = getParentFolder(file.path);

  return (
    <motion.div
      className={`rounded-xl overflow-hidden cursor-pointer group border shadow-sm ${
        isDarkMode 
          ? 'bg-gray-800/95 hover:bg-gray-700/90 border-gray-700/50' 
          : 'bg-white/90 hover:bg-gray-50/95 border-gray-300 hover:border-gray-500'
      } transition-all duration-150 hover:shadow-lg`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(file)}
    >
      <div className={`relative aspect-video p-6 flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gray-900/60 border-gray-700/50' 
          : 'bg-gray-100/80 border-gray-200/70'
      } border-b`}>
        <div className="transform transition-transform duration-150 group-hover:scale-110">
          <FileIcon 
            filename={file.name}
            size={48}
          />
        </div>
        <div className="absolute top-2 left-2 z-10">
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
        <div className="space-y-2">
          <h3 className={`font-medium line-clamp-2 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-900'
          }`}>
            {file.name}
          </h3>
          
          <div className="flex flex-col gap-1">
            <div className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {parentFolder}
            </div>
            
            <div className={`flex items-center gap-4 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatViewCount(file.accessCount)}회</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(file.lastAccessed, 'relative')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};