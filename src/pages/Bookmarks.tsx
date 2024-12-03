import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import FileGrid from '../components/FileGrid';
import { FileType } from '../types';
import { files as apiFiles } from '../services/api';

const Bookmarks = () => {
  const { toggleBookmark } = useStore();
  const [bookmarkedFiles, setBookmarkedFiles] = useState<FileType[]>([]);

  useEffect(() => {
    apiFiles.getBookmarks()
      .then(response => setBookmarkedFiles(response.data));
  }, []);

  const handleToggleBookmark = (fileId: number) => {
    const file = bookmarkedFiles.find(f => f.id === fileId);
    if (file?.bookmarked) {
      apiFiles.removeBookmark(fileId)
        .then(() => {
          toggleBookmark(fileId);
          setBookmarkedFiles(prev => prev.filter(f => f.id !== fileId));
        });
    } else {
      apiFiles.addBookmark(fileId)
        .then(() => {
          toggleBookmark(fileId);
          setBookmarkedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, bookmarked: true } : f
          ));
        });
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-xl font-semibold mb-4">북마크된 파일</h2>
      {bookmarkedFiles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          북마크된 파일이 없습니다.
        </div>
      ) : (
        <FileGrid
          files={bookmarkedFiles}
          onFileSelect={(file) => useStore.getState().watch(file.id)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}
    </div>
  );
};

export default Bookmarks;