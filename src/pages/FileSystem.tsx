import React from 'react';
import { useStore } from '../store/useStore';
import FileSystemView from '../components/FileSystemView';
import PageLayout from '../components/PageLayout';
import { useSearch } from '../hooks/useSearch';

const FileSystem = () => {
  const { files } = useStore();
  const { searchQuery, setSearchQuery, filteredFiles } = useSearch(files);

  return (
    <PageLayout
      title="파일 시스템"
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    >
      <div className="h-full">
        <FileSystemView files={filteredFiles} />
      </div>
    </PageLayout>
  );
};

export default FileSystem;