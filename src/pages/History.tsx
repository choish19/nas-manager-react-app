import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FileType } from '../types';
import { files as apiFiles } from '../services/api';
import { groupBy } from 'lodash';
import { Dictionary } from 'lodash';
import HistoryMonth from '../components/HistoryMonth';
import HistoryStats from '../components/HistoryStats';
import PageLayout from '../components/PageLayout';
import { useSearch } from '../hooks/useSearch';
import { useFileNavigation } from '../hooks/useFileNavigation';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const History = () => {
  const { toggleBookmark, deleteWatchHistory, clearWatchHistory, user } = useStore();
  const [historyFiles, setHistoryFiles] = useState<Dictionary<FileType[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const allFiles = Object.values(historyFiles).flat();
  const { searchQuery, setSearchQuery, filteredFiles } = useSearch(allFiles);
  const { handleFileSelect } = useFileNavigation();
  const isDarkMode = user?.setting.darkMode;

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

  const handleDeleteHistory = async (fileId: number) => {
    try {
      await deleteWatchHistory(fileId);
      setHistoryFiles((prevFiles) => {
        const updatedFiles = { ...prevFiles };
        for (const month in updatedFiles) {
          updatedFiles[month] = updatedFiles[month].filter(file => file.id !== fileId);
          if (updatedFiles[month].length === 0) {
            delete updatedFiles[month];
          }
        }
        return updatedFiles;
      });
    } catch (error) {
      console.error('Failed to delete watch history:', error);
    }
  };

  const handleClearAllHistory = async () => {
    try {
      await clearWatchHistory();
      setHistoryFiles({});
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to clear watch history:', error);
    }
  };

  const groupedFilteredFiles = groupBy(filteredFiles, (file: FileType) => {
    const date = new Date(file.watchedAt!);
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  });

  const DeleteConfirmationModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg p-6 max-w-md w-full shadow-xl`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          모든 시청 기록 삭제
        </h3>
        <p className={`mb-6 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          모든 시청 기록이 영구적으로 삭제됩니다. 계속하시겠습니까?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            취소
          </button>
          <button
            onClick={handleClearAllHistory}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            삭제
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const headerContent = (
    <div className="space-y-6">
      {allFiles.length > 0 && (
        <div className="flex justify-between items-center">
          <HistoryStats files={filteredFiles} />
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-red-400'
                : 'bg-white hover:bg-gray-50 text-red-600'
            }`}
          >
            <Trash2 size={20} />
            <span>모든 기록 삭제</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <PageLayout 
      title="시청 기록" 
      headerContent={headerContent}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    >
      <AnimatePresence>
        {showDeleteConfirm && <DeleteConfirmationModal />}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : allFiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col items-center justify-center h-64 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <p className={`text-lg mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-500'
          }`}>
            시청 기록이 없습니다
          </p>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-400'
          }`}>
            파일을 시청하면 여기에 기록됩니다
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFilteredFiles).map(([month, files]) => (
            <HistoryMonth
              key={month}
              month={month}
              files={files}
              onFileSelect={handleFileSelect}
              onToggleBookmark={handleToggleBookmark}
              onDeleteHistory={handleDeleteHistory}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default History;