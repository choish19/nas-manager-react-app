import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import FileSystemView from '../components/FileSystemView';
import PageLayout from '../components/PageLayout';
import { useSearch } from '../hooks/useSearch';
import { files } from '../services/api';

const FileSystem = () => {
  const { files: storeFiles, setFiles } = useStore();
  const { searchQuery, setSearchQuery, filteredFiles } = useSearch(storeFiles);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await files.getAllWithoutPagination();
        setFiles(response.data);
      } catch (error) {
        console.error('파일을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchFiles();
  }, [setFiles]);

  return (
    <PageLayout
      title="파일 시스템"
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    >
      <div className="h-full max-w-5xl">
        <FileSystemView files={filteredFiles} />
      </div>
    </PageLayout>
  );
};

export default FileSystem;