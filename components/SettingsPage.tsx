import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

interface SettingsPageProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <div className="p-4 md:p-6 lg:p-8 text-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose between light and dark mode.</p>
            </div>
            
            <div className="flex items-center space-x-2">
                <SunIcon className={`h-6 w-6 transition-colors ${!isDarkMode ? 'text-yellow-500' : 'text-gray-500'}`} />
                <button
                    onClick={onToggleTheme}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 ${isDarkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}
                    role="switch"
                    aria-checked={isDarkMode}
                >
                    <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                </button>
                <MoonIcon className={`h-6 w-6 transition-colors ${isDarkMode ? 'text-purple-400' : 'text-gray-500'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;