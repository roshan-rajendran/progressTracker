import React, { useState, useEffect } from 'react';
import type { Task, User, Comment, Role, TaskStatus } from '../types';
import { CalendarIcon, XIcon, DescriptionIcon, SendIcon } from './Icons';

interface TaskDetailModalProps {
  task: Task;
  users: { [key: string]: User };
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  currentUser: User;
  currentUserRole: Role | null;
}

const statusOptions: TaskStatus[] = ['Backlog', 'In Progress', 'Blocked', 'Completed'];
const statusStyles: { [key in TaskStatus]: { indicator: string; text: string } } = {
  'Backlog': { indicator: 'bg-gray-400', text: 'text-gray-800 dark:text-gray-200' },
  'In Progress': { indicator: 'bg-blue-500', text: 'text-blue-800 dark:text-blue-200' },
  'Blocked': { indicator: 'bg-red-500', text: 'text-red-800 dark:text-red-200' },
  'Completed': { indicator: 'bg-green-500', text: 'text-green-800 dark:text-green-200' },
};


const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, users, onClose, onUpdate, currentUser, currentUserRole }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [assigneeIds, setAssigneeIds] = useState(task.assignees);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const canEdit = currentUserRole === 'Admin' || currentUserRole === 'Member';

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setAssigneeIds(task.assignees);
  }, [task]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    onUpdate({
      ...task,
      title,
      description,
      dueDate,
      status,
      assignees: assigneeIds,
    });
  };
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedTask = {
      ...task,
      comments: [...(task.comments || []), comment],
    };
    
    onUpdate(updatedTask);
    setNewComment('');
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getDueDateForInput = (isoDate?: string) => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  };
  
  const toggleAssignee = (userId: string) => {
    if (!canEdit) return;
    setAssigneeIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };
  
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const currentStatusStyle = statusStyles[status] || statusStyles['Backlog'];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl-soft w-full max-w-2xl max-h-[90vh] flex flex-col transition-transform duration-300 transform scale-95 opacity-0 animate-scale-in">
        <style>{`
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in { animation: scale-in 0.2s forwards; }
        `}</style>
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold text-gray-800 dark:text-gray-100 w-full border-none bg-transparent focus:ring-2 focus:ring-primary rounded disabled:bg-transparent"
              disabled={!canEdit}
            />
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="h-6 w-6" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</h3>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
                    disabled={!canEdit}
                >
                    {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <div className="relative">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Assignees</h3>
                <button type="button" onClick={() => canEdit && setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)} className="w-full text-left p-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed" disabled={!canEdit}>
                    <div className="flex -space-x-2">
                        {assigneeIds.map(id => users[id]).filter(Boolean).map(user => (
                        <img
                            key={user.id}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800"
                            src={user.avatarUrl}
                            alt={user.name}
                            title={user.name}
                        />
                        ))}
                    </div>
                     {assigneeIds.length === 0 && <span className="text-sm text-gray-500">Add assignees</span>}
                </button>
                 {isAssigneeDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg-soft">
                  {Object.values(users).map(user => (
                    <label key={user.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input type="checkbox" checked={assigneeIds.includes(user.id)} onChange={() => toggleAssignee(user.id)} className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"/>
                      <img src={user.avatarUrl} alt={user.name} className="h-6 w-6 rounded-full ml-2"/>
                      <span className="ml-2 text-sm text-gray-800 dark:text-gray-200">{user.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
             
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2"/>
                    Due Date
                </h3>
                <input
                    type="date"
                    value={getDueDateForInput(dueDate)}
                    onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
                    disabled={!canEdit}
                />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <DescriptionIcon className="h-4 w-4 mr-2" />
                Description
            </h3>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
              rows={4}
              disabled={!canEdit}
            />
          </div>
            
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
                 <div className="flex flex-wrap gap-1">
                    {task.tags.map(tag => (
                    <span key={tag.name} className={`px-2 py-1 text-xs font-semibold rounded-full ${tag.color}`}>
                        {tag.name}
                    </span>
                    ))}
                </div>
            </div>
          
           {/* Comments Section */}
          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Activity</h3>
            <div className="space-y-4">
              {task.comments?.map(comment => {
                const user = users[comment.userId];
                return user ? (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                      </div>
                      <div className="pl-3 mt-1 flex items-center space-x-2">
                         <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{user.name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
            <div className="mt-6 flex items-start space-x-3">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="relative flex-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment();
                            }
                        }}
                        placeholder="Write a comment..."
                        className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary sm:text-sm"
                        rows={1}
                    />
                    <button 
                        onClick={handleAddComment} 
                        disabled={!newComment.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-primary disabled:text-gray-300 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                        aria-label="Add comment"
                    >
                        <SendIcon className="h-5 w-5"/>
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
          <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
          >
              Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canEdit}
            className="ml-3 px-4 py-2 bg-primary-gradient text-white text-sm font-medium rounded-md shadow-md-soft hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;