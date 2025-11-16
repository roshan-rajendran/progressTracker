import React, { useState } from 'react';
import { LogoIcon, SearchIcon, BellIcon, MenuIcon, LogoutIcon, UserCircleIcon, SettingsIcon } from './Icons';
import type { User } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  user: User | null;
  onToggleSidebar: () => void;
  onNavigate: (view: 'board' | 'profile' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 bg-light/80 dark:bg-dark-blue/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 w-full z-30 flex-shrink-0 transition-colors duration-300 h-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
              <LogoIcon className="h-8 w-8 text-primary" />
              <span className="ml-3 text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight hidden sm:block">Zenith</span>
            </div>
          </div>
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative text-gray-400 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-gray-200/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-2 focus:ring-primary/50 sm:text-sm transition"
                  placeholder="Search projects..."
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="ml-2 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-blue">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
            </button>
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="bg-white dark:bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-blue"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user?.avatarUrl}
                    alt="User avatar"
                  />
                </button>
              </div>
              {isMenuOpen && (
                 <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl-soft py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                 >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-700 dark:text-gray-200">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                    </div>
                    <div className="py-1" role="none">
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('profile'); setIsMenuOpen(false); }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        role="menuitem"
                      >
                        <UserCircleIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400"/>
                        Your Profile
                      </a>
                       <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('settings'); setIsMenuOpen(false); }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        role="menuitem"
                      >
                        <SettingsIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400"/>
                        Settings
                      </a>
                    </div>
                     <div className="py-1 border-t border-gray-200 dark:border-gray-600" role="none">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        role="menuitem"
                      >
                        <LogoutIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400"/>
                        Sign out
                      </a>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;