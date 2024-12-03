import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Moon, 
  Sun, 
  Grid, 
  List, 
  Play, 
  LogOut,
  Monitor,
  Layout,
  Volume2
} from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { useSearch } from '../hooks/useSearch';

const Settings = () => {
  const { user, updateUserSettings, logout } = useStore();
  const { searchQuery, setSearchQuery } = useSearch([]);

  const settingSections = [
    {
      title: '화면',
      icon: <Monitor className="text-indigo-600" size={20} />,
      settings: [
        {
          id: 'darkMode',
          label: '다크 모드',
          description: '어두운 테마를 사용합니다',
          icon: user?.setting.darkMode ? <Moon className="text-indigo-600" /> : <Sun className="text-indigo-600" />,
          type: 'toggle',
          value: user?.setting.darkMode,
          onChange: (value: boolean) => updateUserSettings({ darkMode: value })
        }
      ]
    },
    {
      title: '레이아웃',
      icon: <Layout className="text-indigo-600" size={20} />,
      settings: [
        {
          id: 'defaultView',
          label: '기본 보기 방식',
          description: '파일 목록의 기본 표시 방식을 설정합니다',
          icon: user?.setting.defaultView === 'grid' ? 
            <Grid className="text-indigo-600" /> : 
            <List className="text-indigo-600" />,
          type: 'select',
          value: user?.setting.defaultView,
          options: [
            { value: 'grid', label: '그리드' },
            { value: 'list', label: '리스트' }
          ],
          onChange: (value: string) => updateUserSettings({ defaultView: value as 'grid' | 'list' })
        }
      ]
    },
    {
      title: '재생',
      icon: <Volume2 className="text-indigo-600" size={20} />,
      settings: [
        {
          id: 'autoPlay',
          label: '자동 재생',
          description: '파일을 선택하면 자동으로 재생을 시작합니다',
          icon: <Play className="text-indigo-600" />,
          type: 'toggle',
          value: user?.setting.autoPlay,
          onChange: (value: boolean) => updateUserSettings({ autoPlay: value })
        }
      ]
    }
  ];

  const renderSettingControl = (setting: any) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={setting.value}
              onChange={(e) => setting.onChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
          </label>
        );
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => setting.onChange(e.target.value)}
            className="block w-32 rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {setting.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      title="설정"
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                {section.icon}
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {section.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    {setting.icon}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {setting.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {setting.description}
                      </div>
                    </div>
                  </div>
                  {renderSettingControl(setting)}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: settingSections.length * 0.1 }}
        >
          <button
            onClick={logout}
            className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            로그아웃
          </button>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Settings;