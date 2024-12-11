import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FileType } from '../types';
import { useStore } from '../store/useStore';
import HistoryFileCard from './HistoryFileCard';

interface HistoryMonthProps {
  month: string;
  files: FileType[];
  onFileSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
  onDeleteHistory: (fileId: number) => void;
}

const HistoryMonth: React.FC<HistoryMonthProps> = ({
  month,
  files,
  onFileSelect,
  onToggleBookmark,
  onDeleteHistory,
}) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;
  const [date] = React.useState(() => {
    const [yearStr, monthStr] = month.split('-');
    return new Date(parseInt(yearStr), parseInt(monthStr) - 1);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800/80' : 'bg-white'
      }`}
    >
      <div className={`px-6 py-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className="flex items-center gap-2">
          <Calendar className="text-indigo-500" size={24} />
          <h3 className={`text-xl font-semibold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {format(date, 'yyyy년 M월', { locale: ko })}
          </h3>
          <span className={`text-sm ml-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            ({files.length}개의 파일)
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {files.map((file) => (
            <HistoryFileCard
              key={file.id}
              file={file}
              onSelect={onFileSelect}
              onToggleBookmark={onToggleBookmark}
              onDeleteHistory={onDeleteHistory}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryMonth;