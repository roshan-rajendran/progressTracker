import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon, GoogleIcon, XIcon } from './Icons';
import type { User } from '../types';

interface LoginPageProps {
    users: User[];
}

const AccountChooserModal: React.FC<{ users: User[], onSelect: (user: User) => void, onClose: () => void }> = ({ users, onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl-soft w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700 text-center relative">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Choose an account</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">to continue to Zenith</p>
                    <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                    {users.map(user => (
                        <button
                            key={user.id}
                            onClick={() => onSelect(user)}
                            className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                            <div className="ml-4 text-left">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const LoginPage: React.FC<LoginPageProps> = ({ users }) => {
    const { login } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogin = (user: User) => {
        login(user);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-light dark:bg-dark-blue flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm text-center">
                <div className="flex flex-col items-center mb-8">
                    <LogoIcon className="h-12 w-12 text-primary" />
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-4">Welcome to Zenith</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">The future of project management.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl-soft rounded-lg p-8">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-md-soft bg-white dark:bg-gray-700 text-base font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-blue transition-all transform hover:scale-105 hover:shadow-lg-soft"
                    >
                        <GoogleIcon className="h-5 w-5 mr-3" />
                        Sign in with Google
                    </button>
                </div>
                 <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                    This is a simulated login flow. No real authentication is performed.
                </p>
            </div>
            {isModalOpen && <AccountChooserModal users={users} onSelect={handleLogin} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default LoginPage;