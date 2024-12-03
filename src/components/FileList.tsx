import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileType } from '../types';
import { FileIcon } from './FileIcon';
import { BookmarkButton } from './BookmarkButton';
import { formatDate } from '../utils/dateUtils';
import { Clock, Eye } from 'lucide-react';

interface FileListProps {
  files: FileType[];
  onFileSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onFileSelect, onToggleBookmark }) => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const handleFileClick = (file: FileType) => {
    onFileSelect(file);
    navigate(`/file/${file.id}`);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {files.map((file) => (
        <motion.div
          key={file.id}
          variants={item}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => handleFileClick(file)}
        >
          <div className="flex items-center p-4">
            <div className="h-16 w-16 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 mr-4 flex items-center justify-center">
              <FileIcon filename={file.name} size={32} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatDate(file.lastAccessed)}</span>
                    </div>
                    {file.watchedAt && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{formatDate(file.watchedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <BookmarkButton
                    isBookmarked={file.bookmarked}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(file.id);
                    }}
                  />
                </div>
              </div>
              
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
      ))}
    </motion.div>
  );
};

export default FileList;