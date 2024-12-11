import { FileType } from '../types';

export type FileExtension = 
  | 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' 
  | 'mp4' | 'mp3' | 'wav' 
  | 'zip' | 'rar' 
  | 'jpg' | 'jpeg' | 'png' | 'gif' 
  | 'doc' | 'xls' | 'ppt' 
  | 'unknown';

export const getFileExtension = (filename: string): FileExtension => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return 'unknown';
  
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return ext as FileExtension;
  if (['doc', 'docx'].includes(ext)) return 'docx';
  if (['xls', 'xlsx'].includes(ext)) return 'xlsx';
  if (['ppt', 'pptx'].includes(ext)) return 'pptx';
  if (['mp4', 'mov', 'avi'].includes(ext)) return 'mp4';
  if (['mp3', 'wav'].includes(ext)) return ext as FileExtension;
  if (['zip', 'rar'].includes(ext)) return ext as FileExtension;
  if (ext === 'pdf') return 'pdf';
  if (ext === 'txt') return 'txt';
  
  return 'unknown';
};

export const getFileColor = (extension: FileExtension): string => {
  switch (extension) {
    case 'pdf':
      return 'text-red-500';
    case 'docx':
      return 'text-blue-600';
    case 'xlsx':
      return 'text-green-600';
    case 'pptx':
      return 'text-orange-500';
    case 'txt':
      return 'text-gray-600';
    case 'mp4':
      return 'text-purple-600';
    case 'mp3':
    case 'wav':
      return 'text-pink-500';
    case 'zip':
    case 'rar':
      return 'text-yellow-600';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'text-indigo-500';
    default:
      return 'text-gray-400';
  }
};

export const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const getParentFolder = (filePath: string): string => {
  const parts = filePath.split('/');
  console.log(parts);
  if (parts.length <= 1) return '루트 폴더';
  return parts[parts.length - 2];
};