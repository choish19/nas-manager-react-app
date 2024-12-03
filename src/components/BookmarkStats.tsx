import React from 'react';
import { FileType } from '../types';
import { Bookmark, Film, Music, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

interface BookmarkStatsProps {
  files: FileType[];
}

const BookmarkStats: React.FC<BookmarkStatsProps> = ({ files }) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  const stats = React.useMemo(() => {
    const totalFiles = files.length;
    const typeCount = files.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalFiles,
      video: typeCount['video'] || 0,
      music: typeCount['music'] || 0,
      document: typeCount['document'] || 0,
    };
  }, [files]);

  const statItems = [
    { icon: Bookmark, label: '전체', value: stats.total },
    { icon: Film, label: '비디오', value: stats.video },
    { icon: Music, label: '음악', value: stats.music },
    { icon: FileText, label: '문서', value: stats.document },
  ];

  return (
    <motion.div 
      initial={false}
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`rounded-xl p-4 backdrop-blur-sm ${
            isDarkMode ? 'bg-gray-800/80' : 'bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'
            }`}>
              <item.icon className="text-indigo-500" size={20} />
            </div>
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {item.label}
              </p>
              <p className={`text-xl font-semibold ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                {item.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BookmarkStats;