import React from 'react';
import { Video, Music, FileText, Image, Bookmark, BookmarkCheck } from 'lucide-react';
import { FileType } from '../types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FileListProps {
  files: FileType[];
  onFileSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onFileSelect, onToggleBookmark }) => {
  const navigate = useNavigate();

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'video':
        return 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80';
      case 'music':
        return 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80';
      case 'image':
        return 'https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&w=400&q=80';
      default:
        return 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=400&q=80';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="text-blue-500" />;
      case 'music':
        return <Music className="text-green-500" />;
      case 'image':
        return <Image className="text-purple-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4"
    >
      {files.map((file) => (
        <motion.div
          key={file.id}
          variants={item}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-1 group flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/file/${file.id}`)}
        >
          <div 
            className="w-24 h-24 bg-gray-100 rounded-l-lg relative overflow-hidden cursor-pointer flex-shrink-0"
            onClick={() => onFileSelect(file)}
          >
            <img
              src={file.thumbnail || getDefaultThumbnail(file.type)}
              alt={file.name}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
              {getIcon(file.type)}
            </div>
          </div>
          <div className="p-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 truncate flex-1">{file.name}</h3>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(file.id);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full ml-2 icon-hover"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {file.bookmarked ? (
                  <BookmarkCheck className="text-indigo-600 w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </motion.button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              최근 접근: {file.lastAccessed}
            </p>
            {file.tags && file.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {file.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FileList;