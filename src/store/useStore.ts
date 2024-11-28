import { create } from 'zustand';
import { FileType, ChatMessage } from '../types';
import { persist } from 'zustand/middleware';
import { files as apiFiles } from '../services/api'; // api.ts에서 파일 관련 API 가져오기

interface User {
  id: number;
  username: string;
  email: string;
}

interface StoreState {
  user: User | null;
  files: FileType[];
  viewHistory: number[];
  chatHistory: ChatMessage[];
  settings: {
    darkMode: boolean;
    autoPlay: boolean;
    defaultView: 'grid' | 'list';
  };
  setUser: (user: User | null) => void;
  addToHistory: (fileId: number) => void;
  toggleBookmark: (fileId: number) => void;
  updateSettings: (settings: Partial<StoreState['settings']>) => void;
  incrementAccessCount: (fileId: number) => void;
  incrementRecommendations: (fileId: number) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  fetchFiles: () => void; // 파일을 가져오는 함수 추가
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      files: [],
      viewHistory: [],
      chatHistory: [],
      settings: {
        darkMode: false,
        autoPlay: true,
        defaultView: 'grid',
      },
      setUser: (user) => set({ user }),
      addToHistory: (fileId) =>
        set((state) => ({
          viewHistory: [fileId, ...state.viewHistory.filter((id) => id !== fileId)].slice(0, 50),
        })),
      toggleBookmark: (fileId) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === fileId ? { ...file, bookmarked: !file.bookmarked } : file
          ),
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      incrementAccessCount: (fileId) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === fileId ? { ...file, accessCount: file.accessCount + 1 } : file
          ),
        })),
      incrementRecommendations: (fileId) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === fileId ? { ...file, recommendations: file.recommendations + 1 } : file
          ),
        })),
      addChatMessage: (message) =>
        set((state) => ({
          chatHistory: [...state.chatHistory, {
            ...message,
            id: Math.random().toString(36).substring(2, 11),
            timestamp: Date.now()
          }],
        })),
      fetchFiles: async () => {
        try {
          const response = await apiFiles.getAll();
          set({ files: response.data });
        } catch (error) {
          console.error('Failed to fetch files:', error);
        }
      },
    }),
    {
      name: 'nas-storage',
    }
  )
);