import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import FileGrid from '../components/FileGrid';
import { FileType } from '../types';
import { files as apiFiles } from '../services/api';
import { groupBy } from 'lodash';
import { Dictionary } from 'lodash';

const History = () => {
  const { toggleBookmark } = useStore();
  const [historyFiles, setHistoryFiles] = useState<Dictionary<FileType[]>>({});

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

  useEffect(() => {
    apiFiles.getHistory()
      .then(response => {
        const sortedFiles = response.data.sort((a: FileType, b: FileType) => 
          new Date(b.watchedAt!).getTime() - new Date(a.watchedAt!).getTime()
        );
        const groupedFiles = groupBy(sortedFiles, (file: FileType) => {
          const date = new Date(file.watchedAt!);
          return `${date.getFullYear()}-${date.getMonth() + 1}`;
        });
        setHistoryFiles(groupedFiles);
      });
  }, []);

  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-xl font-semibold mb-4">시청 기록</h2>
      {Object.keys(historyFiles).length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          시청 기록이 없습니다.
        </div>
      ) : (
        Object.entries(historyFiles).map(([month, files]) => (
          <div key={month}>
            <h3 className="text-lg font-medium mb-2">{month}</h3>
            <FileGrid
              files={files}
              onFileSelect={(file) => useStore.getState().watch(file.id)}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default History;