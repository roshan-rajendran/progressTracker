import React, { useState } from 'react';
import type { User, Role } from '../types';
import { XIcon, PlusIcon } from './Icons';

interface ManageMembersModalProps {
  projectUsers: { [key: string]: User };
  projectMembers: { [key: string]: Role };
  allUsers: User[];
  onClose: () => void;
  onUpdateMembers: (updatedMembers: { [userId: string]: Role }, updatedProjectUsers: { [userId: string]: User }) => void;
}

const ManageMembersModal: React.FC<ManageMembersModalProps> = ({ projectUsers, projectMembers, allUsers, onClose, onUpdateMembers }) => {
  const [members, setMembers] = useState(projectMembers);
  const [users, setUsers] = useState(projectUsers);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const checkLastAdmin = (userIdToModify: string, action: 'remove' | 'demote') => {
    const isAdmin = members[userIdToModify] === 'Admin';
    if (!isAdmin) return true;

    const adminCount = Object.values(members).filter(role => role === 'Admin').length;
    if (adminCount <= 1) {
      setError("Cannot remove or demote the last admin of the project.");
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
      return false;
    }
    return true;
  };

  const handleRoleChange = (userId: string, newRole: Role) => {
    if (newRole === 'Member') {
      if (!checkLastAdmin(userId, 'demote')) return;
    }
    setMembers(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleRemoveUser = (userId: string) => {
    if (!checkLastAdmin(userId, 'remove')) return;
    
    const newMembers = { ...members };
    delete newMembers[userId];
    setMembers(newMembers);

    const newUsers = { ...users };
    delete newUsers[userId];
    setUsers(newUsers);
  };
  
  const handleAddUser = () => {
    const userToAdd = allUsers.find(u => u.id === selectedUserId);
    if(userToAdd && !members[selectedUserId]) {
        setMembers(prev => ({ ...prev, [selectedUserId]: 'Member' }));
        setUsers(prev => ({ ...prev, [selectedUserId]: userToAdd }));
    }
    setSelectedUserId('');
    setIsAddingUser(false);
  };

  const handleSaveChanges = () => {
    onUpdateMembers(members, users);
    onClose();
  };
  
  const availableUsersToAdd = allUsers.filter(u => !members[u.id]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl-soft w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Manage Members</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {Object.entries(members).map(([userId, role]) => {
            const user = users[userId];
            if (!user) return null;
            return (
              <div key={userId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                  <span className="ml-4 font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={role}
                    onChange={e => handleRoleChange(userId, e.target.value as Role)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                  <button
                    onClick={() => handleRemoveUser(userId)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"
                    aria-label={`Remove ${user.name}`}
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
           <div className="border-t dark:border-gray-700 pt-4">
            {isAddingUser ? (
                <div className="flex items-center space-x-2">
                    <select
                        value={selectedUserId}
                        onChange={e => setSelectedUserId(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        <option value="" disabled>Select a user to add...</option>
                        {availableUsersToAdd.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    <button onClick={handleAddUser} disabled={!selectedUserId} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:bg-gray-400">Add</button>
                    <button onClick={() => setIsAddingUser(false)}><XIcon className="h-5 w-5 text-gray-500"/></button>
                </div>
            ) : (
                <button
                    onClick={() => setIsAddingUser(true)}
                    className="w-full flex items-center justify-center p-2 text-primary dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-md border-2 border-dashed border-primary/50 dark:border-purple-400/50"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Invite new member
                </button>
            )}
           </div>
        </div>

        <div className="flex justify-end p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-dark-blue/50 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium">Cancel</button>
          <button onClick={handleSaveChanges} className="ml-3 px-4 py-2 bg-primary-gradient text-white rounded-md hover:opacity-90 shadow-md-soft text-sm font-medium transition-opacity">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default ManageMembersModal;