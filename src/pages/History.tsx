import { useStore } from '../store/useStore';
import FileGrid from '../components/FileGrid';
import { FileType } from '../types';

const History = () => {
  const { files, viewHistory, toggleBookmark } = useStore();
  
  const historyFiles = viewHistory
    .map(id => files.find(f => f.id === id))
    .filter((file): file is FileType => file !== undefined);

  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-xl font-semibold mb-4">시청 기록</h2>
      {historyFiles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          시청 기록이 없습니다.
        </div>
      ) : (
        <FileGrid
          files={historyFiles}
          onFileSelect={(file) => useStore.getState().addToHistory(file.id)}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </div>
  );
};

export default History;