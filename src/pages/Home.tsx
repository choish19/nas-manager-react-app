import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FileType, PageRequest, PageResponse, RecommendationResponse } from '../types';
import FileGrid from '../components/FileGrid';
import FileList from '../components/FileList';
import ChatBot from '../components/ChatBot';
import { MessageCircle } from 'lucide-react';
import { FileTypeFilter } from '../components/FileTypeFilter';
import { ViewToggle } from '../components/ViewToggle';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import { useSearch } from '../hooks/useSearch';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { files as apiFiles } from '../services/api';
import RecommendationSection from '../components/RecommendationSection';

const Home = () => {
  const { files, toggleBookmark, watch, user } = useStore();
  const { searchQuery, setSearchQuery, filteredFiles: searchedFiles } = useSearch(files);
  const [showChat, setShowChat] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(user?.setting.defaultView ?? 'grid');
  const [loading, setLoading] = useState(false);
  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 0,
    size: 20,
    sortBy: 'lastAccessed',
    direction: 'DESC',
  });
  const [pageResponse, setPageResponse] = useState<PageResponse<FileType> | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const fetchFiles = async (request: PageRequest) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await apiFiles.getAll(request);
      setPageResponse(prevResponse => {
        if (prevResponse && request.page > 0) {
          return {
            ...response.data,
            content: [...prevResponse.content, ...response.data.content],
          };
        }
        return response.data;
      });
      setPageRequest(request);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const response = await apiFiles.getRecommendations();
      setRecommendations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    fetchFiles(pageRequest);
    fetchRecommendations();
  }, []);

  useInfiniteScroll(
    fetchFiles,
    !pageResponse?.last && !loading,
    loading,
    pageRequest
  );

  const filteredFiles = (pageResponse?.content || []).filter((file) => {
    const matchesType = selectedType === 'all' || file.type === selectedType;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleFileSelect = async (file: FileType) => {
    try {
      await watch(file.id);
    } catch (error) {
      console.error('Failed to watch file:', error);
    }
  };

  const headerContent = (
    <div className="flex items-center justify-between">
      <FileTypeFilter
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
        files={filteredFiles}
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
      <div className="space-y-8">
        {loadingRecommendations ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : recommendations.length > 0 && (
          recommendations.map((recommendation, index) => (
            <RecommendationSection
              key={index}
              recommendation={recommendation}
              onFileSelect={handleFileSelect}
              onToggleBookmark={toggleBookmark}
            />
          ))
        )}

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

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {filteredFiles.length === 0 && !loading && (
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