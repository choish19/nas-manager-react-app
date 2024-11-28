import { useStore } from '../store/useStore';
import FileGrid from '../components/FileGrid';

const Bookmarks = () => {
  const { files, toggleBookmark } = useStore();
  const bookmarkedFiles = files.filter((file) => file.bookmarked);

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
          onFileSelect={(file) => useStore.getState().addToHistory(file.id)}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </div>
  );
};

export default Bookmarks;