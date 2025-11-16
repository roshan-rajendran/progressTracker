import React from 'react';
import type { AllProjectsData, Task } from '../types';
import CalendarTaskItem from './CalendarTaskItem';

interface CalendarViewProps {
  selectedDate: Date;
  projects: AllProjectsData;
  onSelectTask: (taskId: string, projectId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, projects, onSelectTask }) => {
  const selectedDateString = selectedDate.toISOString().split('T')[0];

  const tasksForDay = Object.entries(projects).map(([projectName, projectData]) => {
    const tasks = Object.values(projectData.tasks).filter(task => 
      task.dueDate && task.dueDate.split('T')[0] === selectedDateString
    );
    return { projectName, tasks, projectUsers: projectData.projectUsers };
  }).filter(p => p.tasks.length > 0);

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 text-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">{formattedDate}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          A summary of all deliverables due today across your projects.
        </p>
        
        <div className="mt-8 space-y-6">
          {tasksForDay.length > 0 ? (
            tasksForDay.map(({ projectName, tasks, projectUsers }) => (
              <div key={projectName}>
                <h2 className="text-xl font-semibold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">{projectName}</h2>
                <div className="space-y-2">
                  {tasks.map(task => (
                    <CalendarTaskItem 
                      key={task.id} 
                      task={task} 
                      users={projectUsers} 
                      onSelectTask={() => onSelectTask(task.id, projectName)}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">All clear!</h2>
              <p className="text-gray-500 mt-2">You have no tasks due on this day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;