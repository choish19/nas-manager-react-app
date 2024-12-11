import React, { useState, useEffect } from 'react';
import { Tag as TagIcon, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

interface TagInputProps {
  fileId: number;
  currentTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagInput: React.FC<TagInputProps> = ({
  fileId,
  currentTags,
  onAddTag,
  onRemoveTag,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { user } = useStore();
  const isDarkMode = user?.setting.darkMode;

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/files/tags');
        const tags = await response.json();
        setSuggestions(tags.filter((tag: string) => !currentTags.includes(tag)));
      } catch (error) {
        console.error('Failed to fetch tag suggestions:', error);
      }
    };

    if (isAdding) {
      fetchSuggestions();
    }
  }, [isAdding, currentTags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTag(inputValue.trim());
      setInputValue('');
      setIsAdding(false);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    onAddTag(tag);
    setInputValue('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {currentTags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
              isDarkMode
                ? 'bg-indigo-900/30 text-indigo-300'
                : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            <TagIcon size={14} />
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="p-0.5 hover:bg-indigo-200 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </motion.span>
        ))}
        
        {!isAdding && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsAdding(true)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
              isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Plus size={14} />
            태그 추가
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="새 태그 입력..."
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                autoFocus
              />

              {suggestions.length > 0 && (
                <div className={`mt-2 p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                  <div className="text-sm font-medium mb-2">추천 태그:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleSuggestionClick(tag)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TagInput;