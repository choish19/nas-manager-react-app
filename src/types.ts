export interface FileType {
  id: number;
  name: string;
  type: 'video' | 'music' | 'document' | 'image';
  thumbnail: string;
  lastAccessed: string;
  url: string;
  bookmarked?: boolean;
  accessCount: number;
  recommendations: number;
  description?: string;
  tags?: string[];
}

export interface ViewerProps {
  file: FileType;
  onClose: () => void;
  onToggleBookmark: (fileId: number) => void;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}