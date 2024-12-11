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
  fetchFiles: (page: number) => Promise<FileType[]>;
  fetchUser: () => void;
  logout: () => void;
  addTag: (fileId: number, tag: string) => Promise<void>;
  removeTag: (fileId: number, tag: string) => Promise<void>;
  setFiles: (files: FileType[]) => void;
  deleteWatchHistory: (fileId: number) => Promise<void>;
  clearWatchHistory: () => Promise<void>;
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
      fetchFiles: async (page: number) => {
        try {
          const response = await apiFiles.getAll({ 
            page: page, 
            size: 20,
            sortBy: 'lastWriteTime',
            direction: 'DESC'
          });
          const newFiles = response.data.content;
          const existingIds = new Set(get().files.map(file => file.id));
          const uniqueNewFiles = newFiles.filter(file => !existingIds.has(file.id));
          set({ files: [...get().files, ...uniqueNewFiles] });
          return newFiles;
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
        localStorage.removeItem('nas-storage');
      },
      addTag: async (fileId: number, tag: string) => {
        try {
          await apiFiles.addTag(fileId, tag);
          set((state) => ({
            files: state.files.map((file) =>
              file.id === fileId
                ? { ...file, tags: [...(file.tags || []), tag] }
                : file
            ),
            selectedFile: state.selectedFile?.id === fileId
              ? { ...state.selectedFile, tags: [...(state.selectedFile.tags || []), tag] }
              : state.selectedFile
          }));
        } catch (error) {
          console.error('Failed to add tag:', error);
        }
      },
      removeTag: async (fileId: number, tag: string) => {
        try {
          await apiFiles.removeTag(fileId, tag);
          set((state) => ({
            files: state.files.map((file) =>
              file.id === fileId
                ? { ...file, tags: file.tags?.filter((t) => t !== tag) }
                : file
            ),
            selectedFile: state.selectedFile?.id === fileId
              ? { ...state.selectedFile, tags: state.selectedFile.tags?.filter((t) => t !== tag) }
              : state.selectedFile
          }));
        } catch (error) {
          console.error('Failed to remove tag:', error);
        }
      },
      setFiles: (files) => {
        set({ files });
      },
      deleteWatchHistory: async (fileId: number) => {
        try {
          await apiFiles.deleteWatchHistory(fileId);
          set((state) => ({
            files: state.files.map((file) =>
              file.id === fileId ? { ...file, watchedAt: undefined } : file
            ),
          }));
        } catch (error) {
          console.error('Failed to delete watch history:', error);
        }
      },
      clearWatchHistory: async () => {
        try {
          await apiFiles.clearWatchHistory();
          set((state) => ({
            files: state.files.map((file) => ({ ...file, watchedAt: undefined })),
          }));
        } catch (error) {
          console.error('Failed to clear watch history:', error);
        }
      },
    }),
    {
      name: 'nas-storage',
    }
  )
);