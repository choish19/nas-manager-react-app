import { useStore } from '../store/useStore';
import { ThumbsUp } from 'lucide-react';

const RecommendedFiles = () => {
  const { files, incrementRecommendations } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={file.thumbnail}
                  alt={file.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h4 className="font-medium">{file.name}</h4>
                  <p className="text-sm text-gray-500">{file.description}</p>
                </div>
              </div>
              <button
                onClick={() => incrementRecommendations(file.id)}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
              >
                <ThumbsUp size={18} />
                <span>{file.recommendations}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedFiles;