import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Board from './components/Board';
import TaskDetailModal from './components/TaskDetailModal';
import ManageMembersModal from './components/ManageMembersModal';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import { initialData, allUsers as globalAllUsers } from './data/initialData';
import type { AllProjectsData, ProjectData, Task, ColumnData, User, Role } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { user, loading, updateUser } = useAuth();
  const [data, setData] = useState<AllProjectsData>(initialData);
  const [allUsers, setAllUsers] = useState<User[]>(globalAllUsers);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
  const [view, setView] = useState<'board' | 'profile' | 'settings'>('board');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme) return storedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const userProjects = user ? Object.entries(data)
    .filter(([_, projectData]) => projectData.members && projectData.members[user.id])
    .reduce((acc, [key, val]) => {
      acc[key] = val;
      return acc;
    }, {} as AllProjectsData) : {};
  
  const projectNames = Object.keys(userProjects);
  
  useEffect(() => {
    if (user && !activeProject && projectNames.length > 0) {
      setActiveProject(projectNames[0]);
    } else if (user && activeProject && !userProjects[activeProject]) {
      setActiveProject(projectNames.length > 0 ? projectNames[0] : null);
    } else if (!user) {
      setActiveProject(null);
    }
  }, [user, data, projectNames, activeProject, userProjects]);


  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  const currentProjectData = activeProject ? userProjects[activeProject] : null;
  const currentUserRole = (user && currentProjectData?.members) ? currentProjectData.members[user.id] : null;

  const handleSelectTask = (taskId: string) => {
    if (currentProjectData && currentProjectData.tasks[taskId]) {
      setSelectedTask(currentProjectData.tasks[taskId]);
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    if (!activeProject) return;
    setData(prevData => {
      const currentProject = prevData[activeProject];
      const newTasks = {
        ...currentProject.tasks,
        [updatedTask.id]: updatedTask,
      };
      
      const newProjectData: ProjectData = {
        ...currentProject,
        tasks: newTasks,
      };

      return {
        ...prevData,
        [activeProject]: newProjectData,
      };
    });
    // Do not close modal on comment update
    if(updatedTask.comments?.length === selectedTask?.comments?.length) {
        handleCloseModal();
    } else {
        setSelectedTask(updatedTask);
    }
  };


  const handleDragEnd = useCallback((taskId: string, sourceColumnId: string, targetColumnId: string, destinationIndex: number) => {
    if (!activeProject) return;
    setData(prevData => {
      const currentProject = prevData[activeProject];
      
      const sourceColumn = currentProject.columns[sourceColumnId];
      const targetColumn = currentProject.columns[targetColumnId];

      const startTaskIds = Array.from(sourceColumn.taskIds);
      const sourceIndex = startTaskIds.indexOf(taskId);
      
      startTaskIds.splice(sourceIndex, 1);
      const newSourceColumn = {
        ...sourceColumn,
        taskIds: startTaskIds,
      };

      let newTargetColumn;
      if (sourceColumnId === targetColumnId) {
        startTaskIds.splice(destinationIndex, 0, taskId);
        newTargetColumn = newSourceColumn;
      } else {
        const finishTaskIds = Array.from(targetColumn.taskIds);
        finishTaskIds.splice(destinationIndex, 0, taskId);
        newTargetColumn = {
          ...targetColumn,
          taskIds: finishTaskIds,
        };
      }

      const newProjectData: ProjectData = {
        ...currentProject,
        columns: {
          ...currentProject.columns,
          [newSourceColumn.id]: newSourceColumn,
          [newTargetColumn.id]: newTargetColumn,
        },
      };

      return {
        ...prevData,
        [activeProject]: newProjectData,
      };
    });
  }, [activeProject]);

  const handleAddTask = useCallback((title: string, columnId: string, assigneeIds: string[], dueDate?: string) => {
    if (!activeProject) return;
    setData(prevData => {
      const currentProject = prevData[activeProject];
      const newTaskId = `task-${Date.now()}`;
      
      const newTask: Task = {
        id: newTaskId,
        title,
        description: '',
        assignees: assigneeIds,
        tags: [],
        status: 'Backlog',
        dueDate,
      };
      
      const newTasks = {
        ...currentProject.tasks,
        [newTaskId]: newTask,
      };

      const column = currentProject.columns[columnId];
      const newTaskIds = [...column.taskIds, newTaskId]; // Add to bottom
      const newColumn = {
        ...column,
        taskIds: newTaskIds,
      };
      
      const newProjectData: ProjectData = {
        ...currentProject,
        tasks: newTasks,
        columns: {
          ...currentProject.columns,
          [columnId]: newColumn,
        },
      };

      return {
        ...prevData,
        [activeProject]: newProjectData,
      };
    });
  }, [activeProject]);

  const handleAddNewProject = useCallback((projectName: string) => {
    if (!projectName.trim() || data[projectName.trim()] || !user) return;
    
    const newProjectName = projectName.trim();
    const newProject: ProjectData = {
      projectUsers: { [user.id]: user },
      members: { [user.id]: 'Admin' },
      tasks: {},
      columns: {
        'col-1': { id: 'col-1', title: 'To Do', taskIds: [] },
        'col-2': { id: 'col-2', title: 'In Progress', taskIds: [] },
        'col-3': { id: 'col-3', title: 'Done', taskIds: [] },
      },
      columnOrder: ['col-1', 'col-2', 'col-3'],
    };

    setData(prevData => ({
      ...prevData,
      [newProjectName]: newProject
    }));
    setActiveProject(newProjectName);
  }, [data, user]);
  
  const handleAddNewColumn = useCallback((columnTitle: string) => {
      if (!activeProject) return;
      const newColumnId = `column-${Date.now()}`;
      const newColumn: ColumnData = {
          id: newColumnId,
          title: columnTitle,
          taskIds: [],
      };

      setData(prevData => {
          const currentProject = prevData[activeProject];
          const newProjectData: ProjectData = {
              ...currentProject,
              columns: {
                  ...currentProject.columns,
                  [newColumnId]: newColumn,
              },
              columnOrder: [...currentProject.columnOrder, newColumnId],
          };
          return {
              ...prevData,
              [activeProject]: newProjectData,
          };
      });
  }, [activeProject]);

   const handleUpdateProjectMembers = (updatedMembers: { [userId: string]: Role }, updatedProjectUsers: { [userId: string]: User }) => {
    if (!activeProject) return;
    setData(prevData => {
      const newProjectData: ProjectData = {
        ...prevData[activeProject],
        members: updatedMembers,
        projectUsers: updatedProjectUsers,
      };
      return {
        ...prevData,
        [activeProject]: newProjectData,
      };
    });
  };
  
  const handleUserUpdate = (updatedUser: User) => {
    updateUser(updatedUser);
    // Also update the user in the global user list and all projects they are part of
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setData(prevData => {
        const newData = { ...prevData };
        Object.keys(newData).forEach(projectName => {
            if (newData[projectName].projectUsers[updatedUser.id]) {
                newData[projectName].projectUsers[updatedUser.id] = updatedUser;
            }
        });
        return newData;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-light dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage users={allUsers} />;
  }

  const handleSelectProject = (project: string) => {
    setActiveProject(project);
    setView('board');
    setIsSidebarOpen(false); // Close sidebar on project selection
  };
  
  const renderContent = () => {
    switch (view) {
      case 'profile':
        return <ProfilePage user={user} onUpdateUser={handleUserUpdate} onNavigate={setView} />;
      case 'settings':
        return <SettingsPage isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />;
      case 'board':
      default:
        return currentProjectData && activeProject ? (
          <>
            <div className="p-4 md:p-6 lg:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{activeProject}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Here's a snapshot of your project's progress.</p>
            </div>
            <Board
              columns={currentProjectData.columns}
              tasks={currentProjectData.tasks}
              users={currentProjectData.projectUsers}
              columnOrder={currentProjectData.columnOrder}
              onDragEnd={handleDragEnd}
              onAddTask={handleAddTask}
              onSelectTask={handleSelectTask}
              onAddNewColumn={handleAddNewColumn}
              currentUserRole={currentUserRole}
              onManageMembers={() => setIsManageMembersModalOpen(true)}
            />
          </>
        ) : (
           <div className="flex-1 flex justify-center items-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No projects to display</h2>
                <p className="text-gray-500 mt-2">You are not a member of any projects, or no projects have been created yet.</p>
              </div>
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-light dark:bg-gray-900 font-sans transition-colors duration-300">
      <Header 
        user={user}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={setView}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeProject={activeProject} 
          setActiveProject={handleSelectProject} 
          projects={projectNames}
          onAddNewProject={handleAddNewProject}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentView={view}
          onNavigate={setView}
        />
        <main className="flex-1 flex flex-col overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      {selectedTask && currentProjectData && (
        <TaskDetailModal
          task={selectedTask}
          users={currentProjectData.projectUsers}
          onClose={handleCloseModal}
          onUpdate={handleUpdateTask}
          currentUser={user}
          currentUserRole={currentUserRole}
        />
      )}
      {isManageMembersModalOpen && currentProjectData && (
        <ManageMembersModal
            projectUsers={currentProjectData.projectUsers}
            projectMembers={currentProjectData.members}
            allUsers={allUsers}
            onClose={() => setIsManageMembersModalOpen(false)}
            onUpdateMembers={handleUpdateProjectMembers}
        />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;