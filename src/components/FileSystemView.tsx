import React, { useMemo } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileType } from '../types';
import { useStore } from '../store/useStore';
import FileSystemList from './FileSystemList';
import { useFileNavigation } from '../hooks/useFileNavigation';

interface FileSystemNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: { [key: string]: FileSystemNode };
  files: FileType[];
}

interface FolderNodeProps {
  node: FileSystemNode;
  path: string;
  level: number;
  expanded: Set<string>;
  onToggle: (path: string) => void;
  onFileSelect: (file: FileType) => void;
  onToggleBookmark: (fileId: number) => void;
}

const FolderNode: React.FC<FolderNodeProps> = ({
  node,
  path,
  level,
  expanded,
  onToggle,
  onFileSelect,
  onToggleBookmark,
}) => {
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;
  const isExpanded = expanded.has(path);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(path);
  };

  return (
    <div>
      <motion.div
        onClick={handleToggle}
        className={`flex items-center gap-2 py-2 px-4 cursor-pointer rounded-lg ${
          isDarkMode
            ? 'hover:bg-gray-700/50'
            : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
      >
        <motion.button
          initial={false}
          animate={{ rotate: isExpanded ? 90 : 0 }}
          className={`w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <ChevronRight size={16} />
        </motion.button>
        {isExpanded ? (
          <FolderOpen size={20} className="text-yellow-500" />
        ) : (
          <Folder size={20} className="text-yellow-500" />
        )}
        <span className={`text-sm ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {node.name}
        </span>
        <span className={`text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          ({node.files.length})
        </span>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Object.entries(node.children).map(([childName, childNode]) => (
              <FolderNode
                key={childNode.path}
                node={childNode}
                path={childNode.path}
                level={level + 1}
                expanded={expanded}
                onToggle={onToggle}
                onFileSelect={onFileSelect}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
            {node.files.length > 0 && (
              <div className="py-1">
                <FileSystemList
                  files={node.files}
                  onFileSelect={onFileSelect}
                  onToggleBookmark={onToggleBookmark}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FileSystemViewProps {
  files: FileType[];
}

const FileSystemView: React.FC<FileSystemViewProps> = ({ files }) => {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(['/']));
  const { handleFileSelect } = useFileNavigation();
  const { toggleBookmark } = useStore();

  const fileSystem = useMemo(() => {
    const root: FileSystemNode = {
      name: '/',
      path: '/',
      type: 'folder',
      children: {},
      files: [],
    };

    files.forEach(file => {
      const parts = file.path.split('/').filter(Boolean);
      let currentNode = root;
      let currentPath = '';

      parts.slice(0, -1).forEach(part => {
        currentPath += '/' + part;
        if (!currentNode.children[part]) {
          currentNode.children[part] = {
            name: part,
            path: currentPath,
            type: 'folder',
            children: {},
            files: [],
          };
        }
        currentNode = currentNode.children[part];
      });

      currentNode.files.push(file);
    });

    return root;
  }, [files]);

  const handleToggle = (path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <FolderNode
        node={fileSystem}
        path="/"
        level={0}
        expanded={expanded}
        onToggle={handleToggle}
        onFileSelect={handleFileSelect}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
};

export default FileSystemView;