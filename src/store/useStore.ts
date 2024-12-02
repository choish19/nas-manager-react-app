import { create } from 'zustand';
import { FileType, ChatMessage, User } from '../types';
import { persist } from 'zustand/middleware';
import { files as apiFiles, user as apiUser, chat as apiChat } from '../services/api'; // 필요한 API 가져오기

interface StoreState {
  user: User | null;
  files: FileType[];
  viewHistory: number[];
  chatHistory: ChatMessage[];
  setUser: (user: User | null) => void;
  updateUserSettings: (settings: Partial<User['setting']>) => void;
  addToHistory: (fileId: number) => void;
  toggleBookmark: (fileId: number) => void;
  incrementAccessCount: (fileId: number) => void;
  incrementRecommendations: (fileId: number) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  fetchFiles: () => void;
  fetchUser: () => void;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      files: [],
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
      addToHistory: async (fileId) => {
        try {
          await apiFiles.addToHistory(fileId);
          set((state) => ({
            viewHistory: [fileId, ...state.viewHistory.filter((id) => id !== fileId)].slice(0, 50),
          }));
        } catch (error) {
          console.error('Failed to add to history:', error);
        }
      },
      toggleBookmark: async (fileId) => {
        try {
          await apiFiles.toggleBookmark(fileId);
          set((state) => ({
            files: state.files.map((file) =>
              file.id === fileId ? { ...file, bookmarked: !file.bookmarked } : file
            ),
          }));
        } catch (error) {
          console.error('Failed to toggle bookmark:', error);
        }
      },
      incrementAccessCount: async (fileId) => {
        try {
          await apiFiles.incrementAccessCount(fileId);
          set((state) => ({
            files: state.files.map((file) =>
              file.id === fileId ? { ...file, accessCount: file.accessCount + 1 } : file
            ),
          }));
        } catch (error) {
          console.error('Failed to increment access count:', error);
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
          const response = await apiFiles.getAll();
          set({ files: response.data });
        } catch (error) {
          console.error('Failed to fetch files:', error);
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