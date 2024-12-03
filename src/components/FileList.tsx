import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileType } from '../types';
import { FileIcon } from './FileIcon';
import { BookmarkButton } from './BookmarkButton';
import { formatDate } from '../utils/dateUtils';
import { Clock, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';

interface FileListProps {
  files: FileType[];
  onFileSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onFileSelect, onToggleBookmark }) => {
  const navigate = useNavigate();
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  const handleFileClick = (file: FileType) => {
    onFileSelect(file);
    navigate(`/file/${file.id}`);
  };

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-xl shadow-sm cursor-pointer ${
            isDarkMode 
              ? 'bg-gray-800/80 hover:bg-gray-700/60' 
              : 'bg-white hover:bg-gray-50'
          } transition-colors duration-200`}
          onClick={() => handleFileClick(file)}
        >
          <div className="p-4">
            <div className="flex items-center">
              <div className={`h-12 w-12 flex-shrink-0 rounded-lg p-2.5 mr-4 flex items-center justify-center ${
                isDarkMode ? 'bg-gray-900/40' : 'bg-gray-50'
              }`}>
                <FileIcon filename={file.name} size={24} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-base font-medium truncate mb-1 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDate(file.lastAccessed)}</span>
                      </div>
                      {file.watchedAt && (
                        <div className={`flex items-center text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
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
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FileList;