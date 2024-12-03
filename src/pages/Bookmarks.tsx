import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FileType } from '../types';
import { files as apiFiles } from '../services/api';
import { motion } from 'framer-motion';
import BookmarkStats from '../components/BookMarkStats';
import BookmarkCategories from '../components/BookmarkCategories';
import FileGrid from '../components/FileGrid';
import { groupBy } from 'lodash';

const Bookmarks = () => {
  const { toggleBookmark } = useStore();
  const [bookmarkedFiles, setBookmarkedFiles] = useState<FileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    ? bookmarkedFiles 
    : bookmarkedFiles.filter(file => file.type === selectedCategory);

  const filesByType = groupBy(bookmarkedFiles, 'type');
  const categories = ['all', ...Object.keys(filesByType)];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-none px-4 py-6 border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900">북마크</h1>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : bookmarkedFiles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm"
            >
              <p className="text-gray-500 text-lg mb-2">북마크된 파일이 없습니다</p>
              <p className="text-gray-400 text-sm">
                파일을 북마크하면 여기에 표시됩니다
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-4 space-y-6">
                <BookmarkStats files={bookmarkedFiles} />
                <BookmarkCategories
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  filesByType={filesByType}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <FileGrid
                  files={filteredFiles}
                  onFileSelect={(file) => useStore.getState().watch(file.id)}
                  onToggleBookmark={handleToggleBookmark}
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;