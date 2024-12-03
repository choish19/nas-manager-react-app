import React from 'react';
import { 
  FileText, 
  File, 
  FileSpreadsheet,
  Presentation,
  FileAudio,
  FileVideo,
  FileImage,
  FileArchive,
  FileType as FilePdf
} from 'lucide-react';
import { getFileExtension, getFileColor, FileExtension } from '../utils/fileUtils';

interface FileIconProps {
  filename: string;
  className?: string;
  size?: number;
}

const IconMap: Record<FileExtension, typeof File> = {
  pdf: FilePdf,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  ppt: Presentation,
  pptx: Presentation,
  txt: FileText,
  mp4: FileVideo,
  mp3: FileAudio,
  wav: FileAudio,
  zip: FileArchive,
  rar: FileArchive,
  jpg: FileImage,
  jpeg: FileImage,
  png: FileImage,
  gif: FileImage,
  unknown: File
};

export const FileIcon: React.FC<FileIconProps> = ({ 
  filename, 
  className = '', 
  size = 48 
}) => {
  const extension = getFileExtension(filename);
  const Icon = IconMap[extension];
  const colorClass = getFileColor(extension);

  return (
    <div className="relative inline-flex flex-col items-center group">
      <Icon 
        size={size}
        className={`${className} ${colorClass} transition-all duration-200`}
      />
      <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-medium bg-gray-100 px-1.5 py-0.5 rounded uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {extension}
      </span>
    </div>
  );
};