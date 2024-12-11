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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pr-2">
      {files.map((file) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <FileCard
            file={file}
            onSelect={onFileSelect}
            onToggleBookmark={onToggleBookmark}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FileGrid;