import React, { useState } from 'react';
import type { User } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onNavigate: (view: 'board' | 'profile' | 'settings') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [name, setName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateUser({ ...user, name });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 text-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => onNavigate('board')} className="text-sm text-primary hover:underline mb-4">&larr; Back to board</button>
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-lg-soft rounded-lg p-6 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <img src={user.avatarUrl} alt={user.name} className="h-32 w-32 rounded-full ring-4 ring-primary/20" />
            <div className="flex-1 w-full space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setIsEditing(true)}
                            className="flex-1 block w-full min-w-0 rounded-none rounded-l-md px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-primary focus:border-primary sm:text-sm"
                        />
                         <button
                            onClick={handleSave}
                            disabled={name === user.name || !name.trim()}
                            className="inline-flex items-center px-4 py-2 border border-l-0 border-primary bg-primary-gradient text-white rounded-r-md text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                         >
                            Save
                        </button>
                    </div>
                     {saved && <p className="text-sm text-green-600 dark:text-green-400 mt-2">Profile saved successfully!</p>}
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                     <input
                        type="email"
                        id="email"
                        value={user.email}
                        readOnly
                        className="mt-1 flex-1 block w-full min-w-0 rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 sm:text-sm cursor-not-allowed"
                    />
                </div>
                 <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">User ID</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md mt-1 font-mono">{user.id}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;