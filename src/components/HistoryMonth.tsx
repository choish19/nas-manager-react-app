import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FileType } from '../types';
import FileGrid from './FileGrid';

interface HistoryMonthProps {
  month: string;
  files: FileType[];
  onFileSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

const HistoryMonth: React.FC<HistoryMonthProps> = ({
  month,
  files,
  onFileSelect,
  onToggleBookmark,
}) => {
  const [date] = React.useState(() => {
    const [yearStr, monthStr] = month.split('-');
    return new Date(parseInt(yearStr), parseInt(monthStr) - 1);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="text-indigo-600" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">
            {format(date, 'yyyy년 M월', { locale: ko })}
          </h3>
          <span className="text-sm text-gray-500 ml-2">
            ({files.length}개의 파일)
          </span>
        </div>
      </div>
      <div className="p-6">
        <FileGrid
          files={files}
          onFileSelect={onFileSelect}
          onToggleBookmark={onToggleBookmark}
        />
      </div>
    </motion.div>
  );
};

export default HistoryMonth;