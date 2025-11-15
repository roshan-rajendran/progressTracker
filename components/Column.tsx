import React, { useState } from 'react';
import TaskCard from './TaskCard';
import type { ColumnData, Task, User } from '../types';
import { MoreHorizIcon, PlusIcon, XIcon, CalendarIcon } from './Icons';

interface ColumnProps {
  column: ColumnData;
  tasks: Task[];
  users: { [key: string]: User };
  onDragEnd: (taskId: string, sourceColumnId: string, targetColumnId: string, destinationIndex: number) => void;
  onAddTask: (title: string, columnId: string, assigneeIds: string[], dueDate?: string) => void;
  onSelectTask: (taskId: string) => void;
  canAddTask: boolean;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, users, onDragEnd, onAddTask, onSelectTask, canAddTask }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isAddingCard) {
      textareaRef.current?.focus();
    }
  }, [isAddingCard]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    const dropTarget = e.target as HTMLElement;
    const taskList = dropTarget.closest('.task-list');
    if (!taskList) return;

    const cards = Array.from(taskList.children).filter(c => c.classList.contains('task-card'));
    const dropTargetCard = dropTarget.closest('.task-card');
    
    let destinationIndex = tasks.length;
    if (dropTargetCard) {
        const index = cards.indexOf(dropTargetCard);
        if (index > -1) destinationIndex = index;
    }
    
    if (taskId && sourceColumnId) {
      onDragEnd(taskId, sourceColumnId, column.id, destinationIndex);
    }
  };
  
  const resetAddCardForm = () => {
    setNewCardTitle('');
    setSelectedAssigneeIds([]);
    setDueDate('');
    setIsAddingCard(false);
    setIsAssigneeDropdownOpen(false);
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddTask(newCardTitle.trim(), column.id, selectedAssigneeIds, dueDate || undefined);
      resetAddCardForm();
    }
  };
  
  const toggleAssignee = (userId: string) => {
    setSelectedAssigneeIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };


  return (
    <div
      className="w-full md:w-72 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex flex-col flex-shrink-0"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-3 flex justify-between items-center">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">{column.title}</h3>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-full px-2 py-0.5">{tasks.length}</span>
          <button className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <MoreHorizIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className={`task-list p-1 space-y-2 overflow-y-auto flex-1 transition-colors ${isDraggingOver ? 'bg-purple-100 dark:bg-purple-900/30' : ''}`} style={{maxHeight: 'calc(100vh - 250px)'}}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} users={users} sourceColumnId={column.id} onSelectTask={onSelectTask} />
        ))}
         {isDraggingOver && tasks.length === 0 && (
          <div className="h-20 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg bg-gray-200/50 dark:bg-gray-600/30"></div>
        )}
      </div>
      <div className="p-1 mt-auto">
        {isAddingCard ? (
          <div className="p-1 space-y-2">
            <textarea
              ref={textareaRef}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary sm:text-sm"
              rows={3}
            />

            <div className="relative">
              <button onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)} className="w-full text-left p-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                {selectedAssigneeIds.length > 0 ? `${selectedAssigneeIds.length} assignees` : 'Assign users'}
              </button>
              {isAssigneeDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                  {Object.values(users).map(user => (
                    <label key={user.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input type="checkbox" checked={selectedAssigneeIds.includes(user.id)} onChange={() => toggleAssignee(user.id)} className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"/>
                      <img src={user.avatarUrl} alt={user.name} className="h-6 w-6 rounded-full ml-2"/>
                      <span className="ml-2 text-sm text-gray-800 dark:text-gray-200">{user.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative flex items-center">
                <CalendarIcon className="h-4 w-4 absolute left-2 text-gray-400"/>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full pl-8 p-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm"/>
            </div>

            <div className="mt-2 flex items-center">
              <button
                onClick={handleAddCard}
                disabled={!newCardTitle.trim()}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Add Card
              </button>
              <button
                onClick={resetAddCardForm}
                className="ml-2 p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                 <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          canAddTask && (
            <button
              onClick={() => setIsAddingCard(true)}
              className="w-full h-10 flex items-center justify-start p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 rounded-md transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium">Add a card</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Column;
