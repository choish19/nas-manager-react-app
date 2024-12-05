import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { FileType } from '../types';

export const useFileNavigation = () => {
  const navigate = useNavigate();
  const { watch, setSelectedFile } = useStore();

  const handleFileSelect = async (file: FileType) => {
    try {
      await watch(file.id);
      setSelectedFile(file);
      // Store the current location in history state
      navigate(`/file/${file.id}`, {
        state: { from: window.location.pathname }
      });
    } catch (error) {
      console.error('Failed to handle file selection:', error);
    }
  };

  return { handleFileSelect };
};