import React, { useState, useRef, useEffect } from 'react';
import Column from './Column';
import type { ColumnData, Task, User, Role } from '../types';
import { PlusIcon, XIcon, UsersIcon } from './Icons';

interface BoardProps {
  columns: { [key: string]: ColumnData };
  tasks: { [key: string]: Task };
  users: { [key: string]: User };
  columnOrder: string[];
  onDragEnd: (taskId: string, sourceColumnId: string, targetColumnId: string, destinationIndex: number) => void;
  onAddTask: (title: string, columnId: string, assigneeIds: string[], dueDate?: string) => void;
  onSelectTask: (taskId: string) => void;
  onAddNewColumn: (title: string) => void;
  currentUserRole: Role | null;
  onManageMembers: () => void;
}

const Board: React.FC<BoardProps> = ({ columns, tasks, users, columnOrder, onDragEnd, onAddTask, onSelectTask, onAddNewColumn, currentUserRole, onManageMembers }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingColumn) {
      inputRef.current?.focus();
    }
  }, [isAddingColumn]);
  
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      onAddNewColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };
  
  const canPerformActions = currentUserRole === 'Admin' || currentUserRole === 'Member';

  return (
    <>
    <div className="px-4 md:px-6 lg:px-8 -mt-4 mb-4">
        {currentUserRole === 'Admin' && (
             <button
                onClick={onManageMembers}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                <UsersIcon className="h-5 w-5 mr-2" />
                Manage Members
            </button>
        )}
    </div>
    <div className="flex-1 px-4 md:px-6 lg:px-8 pb-4 flex overflow-x-auto">
      <div className="flex flex-col md:flex-row md:space-x-4 w-full md:items-start">
        {columnOrder.map(columnId => {
          const column = columns[columnId];
          if (!column) return null;
          const columnTasks = column.taskIds.map(taskId => tasks[taskId]).filter(Boolean);
          return (
            <div key={column.id} className="w-full md:w-auto mb-4 md:mb-0">
              <Column
                column={column}
                tasks={columnTasks}
                users={users}
                onDragEnd={onDragEnd}
                onAddTask={onAddTask}
                onSelectTask={onSelectTask}
                canAddTask={canPerformActions}
              />
            </div>
          );
        })}
        <div className="w-full md:w-72 flex-shrink-0">
          {isAddingColumn ? (
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-2">
              <input
                ref={inputRef}
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                placeholder="Enter list title..."
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              />
              <div className="mt-2 flex items-center space-x-2">
                <button
                  onClick={handleAddColumn}
                  disabled={!newColumnTitle.trim()}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add list
                </button>
                <button onClick={() => setIsAddingColumn(false)}>
                  <XIcon className="h-5 w-5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300" />
                </button>
              </div>
            </div>
          ) : (
            canPerformActions && (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="w-full h-12 flex items-center justify-center bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">Add another list</span>
            </button>
            )
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Board;
