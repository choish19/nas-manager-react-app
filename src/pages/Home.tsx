import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FileType } from '../types';
import FileGrid from '../components/FileGrid';
import FileList from '../components/FileList';
import SearchBar from '../components/SearchBar';
import ChatBot from '../components/ChatBot';
import { MessageCircle } from 'lucide-react';

const Home = () => {
  const { files, toggleBookmark, incrementAccessCount, fetchFiles, user } = useStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showChat, setShowChat] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(user?.setting.defaultView ?? 'grid');

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (file: FileType) => {
    incrementAccessCount(file.id);
    useStore.getState().addToHistory(file.id);
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex-1 overflow-y-auto p-6">
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? '리스트 보기' : '그리드 보기'}
          </button>

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
        </div>
      </div>

      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Toggle chat"
      >
        <MessageCircle size={24} />
      </button>

      {showChat && (
        <div className="fixed right-6 bottom-24 w-96 h-[600px] z-40 shadow-xl rounded-lg overflow-hidden">
          <ChatBot onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
};

export default Home;