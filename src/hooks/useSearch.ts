import { useState, useCallback } from 'react';
import { FileType } from '../types';

export const useSearch = (files: FileType[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = files.filter((file) => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearch,
    filteredFiles
  };
};