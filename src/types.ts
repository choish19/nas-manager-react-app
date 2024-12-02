export interface FileType {
  id: number;
  name: string;
  type: string;
  thumbnail?: string;
  lastAccessed: string;
  url?: string;
  bookmarked: boolean;
  bookmarkCount: number;
  accessCount: number;
  recommendations: number;
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