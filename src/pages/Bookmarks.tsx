import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FileType } from '../types';
import { files as apiFiles } from '../services/api';
import BookmarkStats from '../components/BookmarkStats';
import BookmarkCategories from '../components/BookmarkCategories';
import FileGrid from '../components/FileGrid';
import { groupBy } from 'lodash';
import PageLayout from '../components/PageLayout';
import { useSearch } from '../hooks/useSearch';

const Bookmarks = () => {
  const { toggleBookmark } = useStore();
  const [bookmarkedFiles, setBookmarkedFiles] = useState<FileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { searchQuery, setSearchQuery, filteredFiles: searchedFiles } = useSearch(bookmarkedFiles);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await apiFiles.getBookmarks();
        setBookmarkedFiles(response.data);
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleToggleBookmark = async (fileId: number) => {
    try {
      await toggleBookmark(fileId);
      setBookmarkedFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const filteredFiles = selectedCategory === 'all' 
    ? searchedFiles 
    : searchedFiles.filter(file => file.type === selectedCategory);

  const filesByType = groupBy(searchedFiles, 'type');
  const categories = ['all', ...Object.keys(filesByType)];

  const headerContent = bookmarkedFiles.length > 0 ? (
    <div className="space-y-6">
      <BookmarkStats files={searchedFiles} />
      <BookmarkCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        filesByType={filesByType}
      />
    </div>
  ) : null;

  return (
    <PageLayout 
      title="북마크" 
      headerContent={headerContent}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : bookmarkedFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg mb-2">북마크된 파일이 없습니다</p>
          <p className="text-gray-400 text-sm">
            파일을 북마크하면 여기에 표시됩니다
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <FileGrid
            files={filteredFiles}
            onFileSelect={(file) => useStore.getState().watch(file.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        </div>
      )}
    </PageLayout>
  );
};

export default Bookmarks;