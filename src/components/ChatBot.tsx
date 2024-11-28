import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBotProps {
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const { chatHistory, addChatMessage, files } = useStore();

  const analyzeFile = (query: string) => {
    const response = files.some(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
      ? `다음과 같은 파일들을 찾았습니다:\n\n${files
          .filter(file => 
            file.name.toLowerCase().includes(query.toLowerCase()) ||
            file.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          )
          .map(file => `- ${file.name} (${file.type})\n  ${file.description || ''}\n  태그: ${file.tags?.join(', ') || '없음'}`)
          .join('\n\n')}`
      : '죄송합니다. 관련된 파일을 찾을 수 없습니다.';

    return response;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addChatMessage({
      role: 'user',
      content: input
    });

    const response = analyzeFile(input);
    addChatMessage({
      role: 'assistant',
      content: response
    });

    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">파일 분석 도우미</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="파일에 대해 물어보세요..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;