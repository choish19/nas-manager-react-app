import React from 'react';
import { Home, History, Settings, Bookmark, FolderTree } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const { files } = useStore();
  const bookmarkedCount = files.filter(f => f.bookmarked).length;

  const sidebarVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white shadow-lg dark:bg-gray-800 dark:text-white"
    >
      <div className="p-6">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-indigo-600 flex items-center gap-2"
        >
          <span>NAS Manager</span>
        </motion.h1>
      </div>
      
      <nav className="mt-4 space-y-1">
        <SidebarItem 
          to="/" 
          icon={<Home size={20} />} 
          text="홈" 
          active={location.pathname === '/'} 
        />
        <SidebarItem 
          to="/filesystem" 
          icon={<FolderTree size={20} />} 
          text="파일 시스템" 
          active={location.pathname === '/filesystem'} 
        />
        <SidebarItem 
          to="/bookmarks" 
          icon={<Bookmark size={20} />} 
          text="북마크" 
          active={location.pathname === '/bookmarks'}
          badge={bookmarkedCount > 0 ? bookmarkedCount : undefined}
        />
        <SidebarItem 
          to="/history" 
          icon={<History size={20} />} 
          text="시청 기록" 
          active={location.pathname === '/history'}
        />
        <SidebarItem 
          to="/settings" 
          icon={<Settings size={20} />} 
          text="설정" 
          active={location.pathname === '/settings'}
        />
      </nav>
    </motion.div>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  badge?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, active = false, badge }) => {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-colors duration-200
          ${active 
            ? 'bg-indigo-50 text-indigo-600 font-medium border-r-4 border-indigo-600 dark:bg-gray-700' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
      >
        <motion.div
          whileHover={{ rotate: 5 }}
          className="icon-hover"
        >
          {icon}
        </motion.div>
        <span className="flex-1">{text}</span>
        {badge !== undefined && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-sm font-medium dark:bg-indigo-900 dark:text-indigo-200"
          >
            {badge}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
};

export default Sidebar;