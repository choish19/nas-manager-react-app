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

const History = () => {
  const { toggleBookmark } = useStore();
  const [historyFiles, setHistoryFiles] = useState<Dictionary<FileType[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const allFiles = Object.values(historyFiles).flat();
  const { searchQuery, setSearchQuery, filteredFiles } = useSearch(allFiles);
  const { handleFileSelect } = useFileNavigation();

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

  const groupedFilteredFiles = groupBy(filteredFiles, (file: FileType) => {
    const date = new Date(file.watchedAt!);
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  });

  const headerContent = allFiles.length > 0 ? (
    <HistoryStats files={filteredFiles} />
  ) : null;

  return (
    <PageLayout 
      title="시청 기록" 
      headerContent={headerContent}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : allFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg mb-2">시청 기록이 없습니다</p>
          <p className="text-gray-400 text-sm">
            파일을 시청하면 여기에 기록됩니다
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFilteredFiles).map(([month, files]) => (
            <HistoryMonth
              key={month}
              month={month}
              files={files}
              onFileSelect={handleFileSelect}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default History;