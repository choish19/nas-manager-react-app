import React from 'react';
import { motion } from 'framer-motion';
import { FileType } from '../types';
import { FileCard } from './FileCard';

interface FileGridProps {
  files: FileType[];
  onFileSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

const FileGrid: React.FC<FileGridProps> = ({ files, onFileSelect, onToggleBookmark }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onSelect={onFileSelect}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </motion.div>
  );
};

export default FileGrid;