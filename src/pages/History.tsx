import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FileType } from '../types';
import { files as apiFiles } from '../services/api';
import { groupBy } from 'lodash';
import { Dictionary } from 'lodash';
import HistoryMonth from '../components/HistoryMonth';
import HistoryStats from '../components/HistoryStats';
import { motion } from 'framer-motion';

const History = () => {
  const { toggleBookmark } = useStore();
  const [historyFiles, setHistoryFiles] = useState<Dictionary<FileType[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiFiles.getHistory();
        const sortedFiles = response.data.sort((a: FileType, b: FileType) => 
          new Date(b.watchedAt!).getTime() - new Date(a.watchedAt!).getTime()
        );
        const groupedFiles = groupBy(sortedFiles, (file: FileType) => {
          const date = new Date(file.watchedAt!);
          return `${date.getFullYear()}-${date.getMonth() + 1}`;
        });
        setHistoryFiles(groupedFiles);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleToggleBookmark = (fileId: number) => {
    toggleBookmark(fileId);
    setHistoryFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      for (const month in updatedFiles) {
        updatedFiles[month] = updatedFiles[month].map(file =>
          file.id === fileId ? { ...file, bookmarked: !file.bookmarked } : file
        );
      }
      return updatedFiles;
    });
  };

  const allFiles = Object.values(historyFiles).flat();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-none px-4 py-6 border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900">시청 기록</h1>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : allFiles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm"
            >
              <p className="text-gray-500 text-lg mb-2">시청 기록이 없습니다</p>
              <p className="text-gray-400 text-sm">
                파일을 시청하면 여기에 기록됩니다
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-4">
                <HistoryStats files={allFiles} />
              </div>
              <div className="space-y-8">
                {Object.entries(historyFiles).map(([month, files]) => (
                  <HistoryMonth
                    key={month}
                    month={month}
                    files={files}
                    onFileSelect={(file) => useStore.getState().watch(file.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;