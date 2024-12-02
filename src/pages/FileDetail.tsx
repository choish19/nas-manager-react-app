import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FileType } from '../types';
import { files as apiFiles } from '../services/api';


export function FileDetail() {
  const { id } = useParams();
  const { files } = useStore();
  const [recommendedFiles, setRecommendedFiles] = useState<FileType[]>([]);
  const file = files.find((f: FileType) => f.id === Number(id));
  
  useEffect(() => {
    if (file) {
      apiFiles.getRecommendedFiles(file.id)
        .then(response => setRecommendedFiles(response.data));
    }
  }, [file]);

  if (!file) {
    return <div>File not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Files
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold mb-4">{file.name}</h1>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-20 h-20 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">파일명:</span> {file.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">최근 접근:</span> {file.lastAccessed}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">파일 유형:</span> {file.type}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">추천 파일</h2>
          <div className="space-y-4">
            {recommendedFiles.map(recommendedFile => (
              <Link
                key={recommendedFile.id}
                to={`/file/${recommendedFile.id}`}
                className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{recommendedFile.name}</h3>
                    <p className="text-xs text-gray-500">{recommendedFile.lastAccessed}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}