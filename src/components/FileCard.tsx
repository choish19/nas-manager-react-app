import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileType } from '../types';
import { FileIcon } from './FileIcon';
import { BookmarkButton } from './BookmarkButton';
import { formatDate } from '../utils/dateUtils';

interface FileCardProps {
  file: FileType;
  onSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onSelect, onToggleBookmark }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onSelect(file);
    navigate(`/file/${file.id}`);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-out group overflow-hidden cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <FileIcon 
          filename={file.name}
          size={64}
          className="transform transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
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
        <h3 className="font-medium text-gray-900 truncate mb-1">{file.name}</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            최근 접근: {formatDate(file.lastAccessed)}
          </p>
          {file.watchedAt && (
            <p className="text-sm text-gray-500">
              시청 일시: {formatDate(file.watchedAt)}
            </p>
          )}
          {file.tags && file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {file.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full"
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