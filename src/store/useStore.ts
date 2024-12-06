import { create } from 'zustand';
import { FileType, ChatMessage, User } from '../types';
import { persist } from 'zustand/middleware';
import { files as apiFiles, user as apiUser, chat as apiChat } from '../services/api';

interface StoreState {
  user: User | null;
  files: FileType[];
  selectedFile: FileType | null;
  viewHistory: number[];
  chatHistory: ChatMessage[];
  setUser: (user: User | null) => void;
  setSelectedFile: (file: FileType | null) => void;
  updateUserSettings: (settings: Partial<User['setting']>) => void;
  watch: (fileId: number) => Promise<void>;
  toggleBookmark: (fileId: number) => void;
  incrementRecommendations: (fileId: number) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  fetchFiles: () => Promise<FileType[]>;
  fetchUser: () => void;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      files: [],
      selectedFile: null,
      viewHistory: [],
      chatHistory: [],
      setUser: async (user) => {
        try {
          if(user != null) {
            await apiUser.update(user);
            set({ user });
          }
        } catch (error) {
          console.error('Failed to update user:', error);
        }
      },
      setSelectedFile: (file) => {
        set({ selectedFile: file });
      },
      updateUserSettings: async (newSettings) => {
        try {
          if (newSettings) {
            await apiUser.updateSetting(newSettings);
            set((state) => ({
              user: state.user ? { ...state.user, setting: { ...state.user.setting, ...newSettings } } : null,
            }));
          }
        } catch (error) {
          console.error('Failed to update user settings:', error);
        }
      },
      watch: async (fileId) => {
        try {
          await apiFiles.watch(fileId);
          set((state) => ({
            viewHistory: [fileId, ...state.viewHistory.filter((id) => id !== fileId)].slice(0, 50),
            files: state.files.map(file => 
              file.id === fileId 
                ? { ...file, watchedAt: new Date().toISOString() }
                : file
            ),
          }));
        } catch (error) {
          console.error('Failed to watch file:', error);
        }
      },
      toggleBookmark: async (fileId) => {
        try {
          const currentState = get();
          const file = currentState.files.find((f: FileType) => f.id === fileId);
          if(file?.bookmarked) {
            await apiFiles.removeBookmark(fileId);
          } else {
            await apiFiles.addBookmark(fileId);
          }
          set((state) => ({
            files: state.files.map((file) =>
              file.id === fileId ? { ...file, bookmarked: !file.bookmarked } : file
            ),
            selectedFile: state.selectedFile?.id === fileId 
              ? { ...state.selectedFile, bookmarked: !state.selectedFile.bookmarked }
              : state.selectedFile
          }));
        } catch (error) {
          console.error('Failed to toggle bookmark:', error);
        }
      },
      incrementRecommendations: async (fileId) => {
        try {
          await apiFiles.incrementRecommendations(fileId);
          set((state) => ({
            files: state.files.map((file) =>
              file.id === fileId ? { ...file, recommendations: file.recommendations + 1 } : file
            ),
          }));
        } catch (error) {
          console.error('Failed to increment recommendations:', error);
        }
      },
      addChatMessage: async (message) => {
        try {
          const newMessage = {
            ...message,
            id: Math.random().toString(36).substring(2, 11),
            timestamp: Date.now(),
          };
          await apiChat.addMessage(newMessage);
          set((state) => ({
            chatHistory: [...state.chatHistory, newMessage],
          }));
        } catch (error) {
          console.error('Failed to add chat message:', error);
        }
      },
      fetchFiles: async () => {
        try {
          const response = await apiFiles.getAll({ 
            page: 0, 
            size: 20,
            sortBy: 'lastAccessed',
            direction: 'DESC'
          });
          const files = response.data.content;
          set({ files });
          return files;
        } catch (error) {
          console.error('Failed to fetch files:', error);
          return [];
        }
      },
      fetchUser: async () => {
        try {
          const response = await apiUser.get();
          set({ user: response.data });
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      },
      logout: () => {
        set({
          user: null,
          selectedFile: null,
          viewHistory: [],
          chatHistory: [],
        });
        localStorage.removeItem('token');
      },
    }),
    {
      name: 'nas-storage',
    }
  )
);