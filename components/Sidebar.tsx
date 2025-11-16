import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon, BoardIcon, SettingsIcon, PlusIcon, XIcon } from './Icons';
import SidebarCalendar from './SidebarCalendar';
import { ViewType } from '../types';

interface SidebarProps {
  activeProject: string | null;
  setActiveProject: (project: string) => void;
  projects: string[];
  onAddNewProject: (projectName: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  datesWithTasks: Set<string>;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeProject, 
  setActiveProject, 
  projects, 
  onAddNewProject, 
  isOpen, 
  onClose, 
  currentView, 
  onNavigate,
  onSelectDate,
  selectedDate,
  datesWithTasks
}) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingProject) {
      inputRef.current?.focus();
    }
  }, [isAddingProject]);

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      onAddNewProject(newProjectName.trim());
      setNewProjectName('');
      setIsAddingProject(false);
    }
  };

  const handleCalendarNav = () => {
    onSelectDate(new Date());
    onNavigate('calendar');
    onClose();
  };

  const sidebarContent = (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-4">
            {/* Projects Section */}
            <div>
              <div className="px-2 flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Projects
                </h3>
                 <button 
                  onClick={() => setIsAddingProject(true)}
                  className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Add new project"
                 >
                   <PlusIcon className="h-5 w-5"/>
                </button>
              </div>
              <div className="space-y-1">
                {isAddingProject && (
                   <div className="p-2">
                     <input
                        ref={inputRef}
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                        placeholder="New project name..."
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                     />
                     <div className="mt-2 flex items-center justify-end space-x-2">
                       <button onClick={() => setIsAddingProject(false)}><XIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"/></button>
                       <button onClick={handleAddProject} className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary-hover focus:outline-none disabled:bg-gray-400" disabled={!newProjectName.trim()}>Add</button>
                     </div>
                   </div>
                )}
                {projects.map(project => (
                  <a
                    key={project}
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveProject(project);}}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 relative
                      ${
                        project === activeProject && currentView === 'board'
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-purple-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-500/5 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    {project === activeProject && currentView === 'board' && (
                      <span className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full"></span>
                    )}
                    <BoardIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="truncate">{project}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Calendar Section */}
            <div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleCalendarNav(); }}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentView === 'calendar'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-500/5 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
                Calendar
              </a>
              <div className="pt-2">
                 <SidebarCalendar 
                  onSelectDate={onSelectDate} 
                  selectedDate={selectedDate}
                  datesWithTasks={datesWithTasks}
                />
              </div>
            </div>

          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-2">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('settings');}} className="flex-shrink-0 w-full group block">
             <div className={`flex items-center p-2 rounded-md ${currentView === 'settings' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-500/5 dark:hover:bg-gray-700/50'}`}>
                <SettingsIcon className="mr-3 h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
                 <p className={`text-sm font-medium ${currentView === 'settings' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                    Settings
                </p>
            </div>
          </a>
        </div>
      </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-black/60 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
        ></div>
        
        {/* Sidebar Panel */}
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-light dark:bg-gray-800 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <XIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 bg-light dark:bg-gray-800 flex-shrink-0 border-r border-gray-200 dark:border-gray-700/50 flex flex-col transition-colors duration-300">
           {sidebarContent}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;