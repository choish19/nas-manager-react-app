import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { FileType } from '../types';

export const useFileNavigation = () => {
  const navigate = useNavigate();
  const { watch } = useStore();

  const handleFileSelect = async (file: FileType) => {
    try {
      await watch(file.id);
      navigate(`/file/${file.id}`);
    } catch (error) {
      console.error('Failed to handle file selection:', error);
    }
  };

  return { handleFileSelect };
};