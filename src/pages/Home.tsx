import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FileType } from '../types';
import FileGrid from '../components/FileGrid';
import FileList from '../components/FileList';
import ChatBot from '../components/ChatBot';
import { MessageCircle } from 'lucide-react';
import { FileTypeFilter } from '../components/FileTypeFilter';
import { ViewToggle } from '../components/ViewToggle';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import { useSearch } from '../hooks/useSearch';

const Home = () => {
  const { files, toggleBookmark, watch, fetchFiles, user } = useStore();
  const { searchQuery, setSearchQuery, filteredFiles: searchedFiles } = useSearch(files);
  const [showChat, setShowChat] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(user?.setting.defaultView ?? 'grid');

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const filteredFiles = searchedFiles.filter((file) => {
    const matchesType = selectedType === 'all' || file.type === selectedType;
    return matchesType;
  });

  const handleFileSelect = (file: FileType) => {
    watch(file.id);
  };

  const headerContent = (
    <div className="flex items-center justify-between">
      <FileTypeFilter
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
        files={searchedFiles}
      />
      <ViewToggle view={viewMode} onViewChange={setViewMode} />
    </div>
  );

  return (
    <PageLayout 
      title="파일" 
      headerContent={headerContent}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    >
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-[200px]"
          >
            {viewMode === 'grid' ? (
              <FileGrid
                files={filteredFiles}
                onFileSelect={handleFileSelect}
                onToggleBookmark={toggleBookmark}
              />
            ) : (
              <FileList
                files={filteredFiles}
                onFileSelect={handleFileSelect}
                onToggleBookmark={toggleBookmark}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {filteredFiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <p className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</p>
            <p className="text-gray-400 text-sm">
              다른 검색어나 필터를 시도해보세요
            </p>
          </motion.div>
        )}
      </div>

      <motion.button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle chat"
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed right-6 bottom-24 w-96 h-[600px] z-40 shadow-xl rounded-lg overflow-hidden"
          >
            <ChatBot onClose={() => setShowChat(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Home;