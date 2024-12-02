import React from 'react';
import { useStore } from '../store/useStore';
import { Moon, Sun, Grid, List, Play } from 'lucide-react';

const Settings = () => {
  const { user, updateUserSettings } = useStore();

  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-xl font-semibold mb-6">설정</h2>
      
      <div className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">화면 설정</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user?.setting.darkMode ? <Moon className="text-indigo-600" /> : <Sun className="text-indigo-600" />}
                <span>다크 모드</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user?.setting.darkMode}
                  onChange={(e) => updateUserSettings({ darkMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="text-indigo-600" />
                <span>자동 재생</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user?.setting.autoPlay}
                  onChange={(e) => updateUserSettings({ autoPlay: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user?.setting.defaultView === 'grid' ? (
                  <Grid className="text-indigo-600" />
                ) : (
                  <List className="text-indigo-600" />
                )}
                <span>기본 보기 방식</span>
              </div>
              <select
                value={user?.setting.defaultView}
                onChange={(e) => updateUserSettings({ defaultView: e.target.value as 'grid' | 'list' })}
                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="grid">그리드</option>
                <option value="list">리스트</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;