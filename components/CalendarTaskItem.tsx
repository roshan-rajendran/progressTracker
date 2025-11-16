import React from 'react';
import type { Task, User, TaskStatus } from '../types';

interface CalendarTaskItemProps {
  task: Task;
  users: { [key: string]: User };
  onSelectTask: () => void;
}

const statusStyles: { [key in TaskStatus]: { indicator: string; text: string } } = {
  'Backlog': { indicator: 'bg-gray-400', text: 'text-gray-800 dark:text-gray-300' },
  'In Progress': { indicator: 'bg-blue-500', text: 'text-blue-800 dark:text-blue-300' },
  'Blocked': { indicator: 'bg-red-500', text: 'text-red-800 dark:text-red-300' },
  'Completed': { indicator: 'bg-green-500', text: 'text-green-800 dark:text-green-300' },
};

const CalendarTaskItem: React.FC<CalendarTaskItemProps> = ({ task, users, onSelectTask }) => {
  const assignees = task.assignees.map(id => users[id]).filter(Boolean);
  const currentStatusStyle = statusStyles[task.status] || statusStyles['Backlog'];

  return (
    <div
      onClick={onSelectTask}
      className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md-soft border border-gray-200 dark:border-gray-700/50 hover:shadow-lg-soft hover:border-primary/50 cursor-pointer transition-all duration-200 flex items-center justify-between"
    >
      <div>
        <h4 className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-100">{task.title}</h4>
        <div className="flex items-center">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center bg-opacity-20 ${currentStatusStyle.text}`}>
                <span className={`h-2 w-2 rounded-full mr-2 ${currentStatusStyle.indicator}`}></span>
                {task.status}
            </span>
        </div>
      </div>
      <div className="flex items-center -space-x-2">
        {assignees.map(user => (
          <img
            key={user.id}
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
            src={user.avatarUrl}
            alt={user.name}
            title={user.name}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarTaskItem;