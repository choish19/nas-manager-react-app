import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Bookmark, BookmarkCheck, Clock, Tag, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FileType } from '../types';
import { files as apiFiles } from '../services/api';
import { motion } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import { formatDate } from '../utils/dateUtils';
import { FileIcon } from '../components/FileIcon';

export function FileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { files, toggleBookmark, user } = useStore();
  const [recommendedFiles, setRecommendedFiles] = useState<FileType[]>([]);
  const file = files.find((f: FileType) => f.id === Number(id));
  const isDarkMode = user?.setting.darkMode;
  
  useEffect(() => {
    if (file) {
      apiFiles.getRecommendedFiles(file.id)
        .then(response => setRecommendedFiles(response.data));
    }
  }, [file]);

  if (!file) {
    return (
      <PageLayout
        title="파일 상세"
        searchQuery=""
        onSearch={() => {}}
      >
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 text-lg">파일을 찾을 수 없습니다</p>
        </div>
      </PageLayout>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const FileDetailCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}
    >
      <div className={`p-6 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={`text-xl font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {file.name}
            </h1>
          </div>
          <button
            onClick={() => toggleBookmark(file.id)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            {file.bookmarked ? (
              <BookmarkCheck className="text-indigo-500" size={20} />
            ) : (
              <Bookmark className={
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              } size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className={`aspect-video rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
            }`}>
              <FileIcon filename={file.name} size={64} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-indigo-500" />
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    최근 접근
                  </span>
                </div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {formatDate(file.lastAccessed)}
                </p>
              </div>

              {file.watchedAt && (
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={16} className="text-indigo-500" />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      시청 일시
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formatDate(file.watchedAt)}
                  </p>
                </div>
              )}
            </div>

            {file.tags && file.tags.length > 0 && (
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-indigo-500" />
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    태그
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {file.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full ${
                        isDarkMode 
                          ? 'bg-indigo-900/30 text-indigo-300' 
                          : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                추천 파일
              </h2>
              <div className="space-y-3">
                {recommendedFiles.map(recommendedFile => (
                  <motion.button
                    key={recommendedFile.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/file/${recommendedFile.id}`)}
                    className={`w-full p-3 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-800 bg-gray-800/50' 
                        : 'hover:bg-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileIcon filename={recommendedFile.name} size={24} />
                      <div className="flex-1 text-left">
                        <h3 className={`text-sm font-medium truncate ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {recommendedFile.name}
                        </h3>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {formatDate(recommendedFile.lastAccessed)}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <PageLayout
      title="파일 상세"
      searchQuery=""
      onSearch={() => {}}
    >
      <div className="py-6">
        <FileDetailCard />
      </div>
    </PageLayout>
  );
}

export default FileDetail;