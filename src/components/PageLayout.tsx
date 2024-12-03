import React from 'react';
import SearchBar from './SearchBar';

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
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-none border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="max-w-4xl ml-0">
            <SearchBar searchQuery={searchQuery} setSearchQuery={onSearch} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-stable">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {headerContent && (
            <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-4">
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