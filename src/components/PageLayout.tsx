import React from 'react';
import SearchBar from './SearchBar';
import { useStore } from '../store/useStore';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  headerContent,
  searchQuery,
  onSearch
}) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  return (
    <div className={`h-screen flex flex-col ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`flex-none border-b shadow-sm ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="max-w-4xl ml-0">
            <SearchBar searchQuery={searchQuery} setSearchQuery={onSearch} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-stable">
        <div className="max-w-[1920px] mx-auto px-6 py-6">
          {headerContent && (
            <div className={`sticky top-0 z-10 pt-2 pb-4 ${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              {headerContent}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;