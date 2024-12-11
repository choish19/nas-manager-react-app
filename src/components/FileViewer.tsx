import React from 'react';
import { X, Bookmark, BookmarkCheck } from 'lucide-react';
import { ViewerProps } from '../types';

const FileViewer: React.FC<ViewerProps> = ({ file, onClose, onToggleBookmark }) => {
  const renderContent = () => {
    switch (file.type) {
      case 'video':
        return (
          <video 
            controls 
            className="w-full h-full max-h-[calc(100vh-12rem)] object-contain"
            src={file.path}
          />
        );
      case 'music':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 p-8">
            <audio controls src={file.path} className="w-full max-w-2xl" />
          </div>
        );
      case 'image':
        return (
          <img 
            src={file.path} 
            alt={file.name}
            className="w-full h-full max-h-[calc(100vh-12rem)] object-contain"
          />
        );
      case 'document':
        return (
          <iframe
            src={file.path}
            className="w-full h-full max-h-[calc(100vh-12rem)]"
            title={file.name}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p>미리보기를 지원하지 않는 파일 형식입니다.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b">
          <h3 className="text-lg font-semibold">{file.name}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(file.id)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {file.bookmarked ? (
                <BookmarkCheck className="text-indigo-600" />
              ) : (
                <Bookmark />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X />
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;