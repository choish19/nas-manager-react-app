import React from 'react';
import { motion } from 'framer-motion';
import { FileType } from '../types';
import { FileIcon } from './FileIcon';
import { BookmarkButton } from './BookmarkButton';
import { formatDate } from '../utils/dateUtils';
import { Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatViewCount } from '../utils/fileUtils';

interface FileSystemListProps {
  files: FileType[];
  depth: number;
  onFileSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

const FileSystemList: React.FC<FileSystemListProps> = ({
  files,
  depth,
  onFileSelect,
  onToggleBookmark,
}) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  return (
    <div className="space-y-0.5">
      {files.map((file) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`group flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer ${
            isDarkMode
              ? 'hover:bg-gray-700/50'
              : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${(depth * 20) + 8}px` }}
          onClick={() => onFileSelect(file)}
        >
          <div className="w-4" /> {/* Spacing for alignment with folders */}
          <div className="flex-shrink-0">
            <FileIcon filename={file.name} size={18} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-medium truncate ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {file.name}
              </h3>
            </div>
          </div>

          <div className={`flex items-center gap-4 text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="flex items-center gap-1">
              <span className="font-medium">조회수</span>
              <span>{formatViewCount(file.accessCount)}회</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(file.lastWriteTime, 'relative')}</span>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <BookmarkButton
              isBookmarked={file.bookmarked}
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(file.id);
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FileSystemList;