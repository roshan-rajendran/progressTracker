import React from 'react';
import type { Task, User, TaskStatus } from '../types';
import { ChatAltIcon, CalendarIcon } from './Icons';

interface TaskCardProps {
  task: Task;
  users: { [key: string]: User };
  sourceColumnId: string;
  onSelectTask: (taskId: string) => void;
}

const statusStyles: { [key in TaskStatus]: { indicator: string; text: string, bg: string } } = {
  'Backlog': { indicator: 'bg-gray-400', text: 'text-gray-800 dark:text-gray-300', bg: 'bg-gray-200/50 dark:bg-gray-600/30' },
  'In Progress': { indicator: 'bg-blue-500', text: 'text-blue-800 dark:text-blue-300', bg: 'bg-blue-500/10 dark:bg-blue-500/20' },
  'Blocked': { indicator: 'bg-red-500', text: 'text-red-800 dark:text-red-300', bg: 'bg-red-500/10 dark:bg-red-500/20' },
  'Completed': { indicator: 'bg-green-500', text: 'text-green-800 dark:text-green-300', bg: 'bg-green-500/10 dark:bg-green-500/20' },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, users, sourceColumnId, onSelectTask }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
    e.currentTarget.classList.add('opacity-50', 'rotate-3');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.classList.remove('opacity-50', 'rotate-3');
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight this morning to compare dates only
  const isPastDue = task.dueDate && new Date(task.dueDate) < today;
  
  const formattedDueDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  const assignees = task.assignees.map(id => users[id]).filter(Boolean);

  const currentStatusStyle = statusStyles[task.status] || statusStyles['Backlog'];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onSelectTask(task.id)}
      className={`relative task-card bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md-soft border border-gray-200 dark:border-gray-700/50 hover:shadow-xl-soft hover:-translate-y-1 hover:border-primary/50 cursor-pointer active:cursor-grabbing transition-all duration-300 ${isPastDue ? 'border-l-4 border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-l-4 border-transparent'}`}
    >
      <div className="flex items-center mb-3">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center ${currentStatusStyle.bg} ${currentStatusStyle.text}`}>
          <span className={`h-2 w-2 rounded-full mr-2 ${currentStatusStyle.indicator}`}></span>
          {task.status}
        </span>
      </div>
      <h4 className={`font-semibold text-sm mb-2 ${isPastDue ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-100'}`}>{task.title}</h4>
      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map(tag => (
          <span key={tag.name} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${tag.color} dark:bg-opacity-80`}>
            {tag.name}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {assignees.map(user => (
              <img
                key={user.id}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800"
                src={user.avatarUrl}
                alt={user.name}
                title={user.name}
              />
            ))}
          </div>
          {formattedDueDate && (
              <div className={`flex items-center ml-4 text-xs ${isPastDue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formattedDueDate}</span>
              </div>
            )}
        </div>
        {(task.comments?.length || 0) > 0 && (
          <div className="flex items-center text-gray-400 dark:text-gray-500">
            <ChatAltIcon className="h-4 w-4" />
            <span className="text-xs ml-1 font-medium">{task.comments?.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;