export interface FileType {
  id: number;
  name: string;
  type: string;
  thumbnail?: string;
  lastWriteTime: string;
  path: string;
  bookmarked: boolean;
  bookmarkCount: number;
  accessCount: number;
  recommendations: number;
  watchedAt?: string;
  tags?: string[];
}

export interface ViewerProps {
  file: FileType;
  onClose: () => void;
  onToggleBookmark: (fileId: number) => void;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  setting: {
    darkMode: boolean;
    autoPlay: boolean;
    defaultView: 'grid' | 'list';
  };
}

export interface PageRequest {
  page: number;
  size: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface RecommendationResponse {
  files: FileType[];
  reason: string;
}