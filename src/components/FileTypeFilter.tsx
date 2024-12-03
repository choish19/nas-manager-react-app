import React from 'react';
import { motion } from 'framer-motion';
import { FileIcon } from './FileIcon';
import { FileType } from '../types';
import { useStore } from '../store/useStore';

interface FileTypeFilterProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  files: FileType[];
}

export const FileTypeFilter: React.FC<FileTypeFilterProps> = ({
  selectedType,
  onTypeSelect,
  files,
}) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;
  
  const fileTypes = ['all', 'document', 'video', 'audio', 'image', 'archive'];
  const typeLabels: Record<string, string> = {
    all: '전체',
    document: '문서',
    video: '비디오',
    audio: '오디오',
    image: '이미지',
    archive: '압축파일',
  };

  const getTypeCount = (type: string): number => {
    if (type === 'all') return files.length;
    return files.filter(file => file.type === type).length;
  };

  const getExampleFile = (type: string): string => {
    switch (type) {
      case 'document': return 'example.docx';
      case 'video': return 'example.mp4';
      case 'audio': return 'example.mp3';
      case 'image': return 'example.jpg';
      case 'archive': return 'example.zip';
      default: return 'example.txt';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {fileTypes.map((type) => (
        <motion.button
          key={type}
          onClick={() => onTypeSelect(type)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            transition-colors duration-200
            ${selectedType === type
              ? 'bg-indigo-600 text-white'
              : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }
          `}
          whileTap={{ scale: 0.97 }}
        >
          <FileIcon filename={getExampleFile(type)} size={18} />
          <span>{typeLabels[type]}</span>
          <span className={`
            px-2 py-0.5 text-xs rounded-full
            transition-colors duration-200
            ${selectedType === type
              ? 'bg-indigo-500 text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-600'
            }
          `}>
            {getTypeCount(type)}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default FileTypeFilter;