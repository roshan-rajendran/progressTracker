import type { AllProjectsData, User } from '../types';

export const allUsers: User[] = [
  { id: 'user-1', name: 'Olivia Chen', avatarUrl: 'https://i.pravatar.cc/150?u=olivia', email: 'olivia.chen@example.com' },
  { id: 'user-2', name: 'Ben Carter', avatarUrl: 'https://i.pravatar.cc/150?u=ben', email: 'ben.carter@example.com' },
  { id: 'user-3', name: 'Sophia Rodriguez', avatarUrl: 'https://i.pravatar.cc/150?u=sophia', email: 'sophia.rodriguez@example.com' },
  { id: 'user-4', name: 'Liam Goldberg', avatarUrl: 'https://i.pravatar.cc/150?u=liam', email: 'liam.goldberg@example.com' },
  { id: 'user-5', name: 'Ava Nguyen', avatarUrl: 'https://i.pravatar.cc/150?u=ava', email: 'ava.nguyen@example.com' },
];

const projectAlphaUsers = {
  'user-1': allUsers[0],
  'user-2': allUsers[1],
  'user-3': allUsers[2],
  'user-4': allUsers[3],
};

const marketingUsers = {
  'user-1': allUsers[0],
  'user-3': allUsers[2],
};

export const initialData: AllProjectsData = {
  'Project Alpha': {
    projectUsers: projectAlphaUsers,
    members: {
      'user-1': 'Admin',
      'user-2': 'Member',
      'user-3': 'Member',
      'user-4': 'Member',
    },
    tasks: {
      'task-1': {
        id: 'task-1',
        title: 'Design landing page mockups',
        description: 'Create high-fidelity mockups in Figma for the new marketing landing page.',
        assignees: ['user-1'],
        status: 'Backlog',
        tags: [{ name: 'UI/UX', color: 'bg-blue-200 text-blue-800' }, { name: 'Design', color: 'bg-purple-200 text-purple-800' }],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
        comments: [
            { id: 'comment-1', userId: 'user-2', content: 'Great, I will be waiting for the mockups to start the development.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { id: 'comment-2', userId: 'user-1', content: 'Working on it! Should have a first draft by EOD.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        ],
      },
      'task-2': {
        id: 'task-2',
        title: 'Develop user authentication API',
        description: 'Set up Passport.js for email/password and social logins.',
        assignees: ['user-2'],
        status: 'In Progress',
        tags: [{ name: 'Backend', color: 'bg-yellow-200 text-yellow-800' }, { name: 'API', color: 'bg-red-200 text-red-800' }],
        dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
         comments: [
            { id: 'comment-3', userId: 'user-4', content: 'How is the progress on this? Do we need any help with the frontend integration?', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        ],
      },
      'task-3': {
        id: 'task-3',
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions to automate testing and deployment.',
        assignees: ['user-2', 'user-4'],
        status: 'Completed',
        tags: [{ name: 'DevOps', color: 'bg-gray-200 text-gray-800' }],
      },
      'task-4': {
        id: 'task-4',
        title: 'Write user documentation for v1.0',
        description: 'Draft the initial version of the user guide and API reference.',
        assignees: ['user-3'],
        status: 'Backlog',
        tags: [{ name: 'Docs', color: 'bg-green-200 text-green-800' }],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      },
      'task-5': {
        id: 'task-5',
        title: 'Implement responsive navigation bar',
        description: 'Code the main navigation component using React and Tailwind CSS.',
        assignees: ['user-4'],
        status: 'In Progress',
        tags: [{ name: 'Frontend', color: 'bg-indigo-200 text-indigo-800' }],
      },
       'task-6': {
        id: 'task-6',
        title: 'QA testing for new features',
        description: 'Perform end-to-end testing on the staging environment.',
        assignees: ['user-3'],
        status: 'Completed',
        tags: [{ name: 'QA', color: 'bg-pink-200 text-pink-800' }],
      },
       'task-7': {
        id: 'task-7',
        title: 'Database schema design',
        description: 'Finalize the PostgreSQL database schema for the new inventory module.',
        assignees: ['user-2'],
        status: 'Blocked',
        tags: [{ name: 'Backend', color: 'bg-yellow-200 text-yellow-800' }, {name: 'Database', color: 'bg-teal-200 text-teal-800'}],
        dueDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      },
      'task-8': {
        id: 'task-8',
        title: 'User interview synthesis',
        description: 'Analyze notes from recent user interviews to identify key pain points.',
        assignees: ['user-1'],
        status: 'Backlog',
        tags: [{ name: 'Research', color: 'bg-cyan-200 text-cyan-800' }],
      },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'Backlog',
        taskIds: ['task-1', 'task-4', 'task-8'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In Progress',
        taskIds: ['task-2', 'task-5'],
      },
      'column-3': {
        id: 'column-3',
        title: 'In Review',
        taskIds: ['task-7'],
      },
      'column-4': {
        id: 'column-4',
        title: 'Done',
        taskIds: ['task-3', 'task-6'],
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
  },
  'Marketing Campaign': {
    projectUsers: marketingUsers,
    members: {
        'user-3': 'Admin',
        'user-1': 'Member',
    },
    tasks: {
        'm-task-1': {
            id: 'm-task-1',
            title: 'Draft social media copy',
            description: 'Write copy for Twitter, Facebook, and LinkedIn announcements.',
            assignees: ['user-3'],
            status: 'In Progress',
            tags: [{ name: 'Content', color: 'bg-green-200 text-green-800' }],
            dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
        },
        'm-task-2': {
            id: 'm-task-2',
            title: 'Design ad creatives',
            description: 'Create visuals for the new ad campaign.',
            assignees: ['user-1'],
            status: 'Backlog',
            tags: [{ name: 'Design', color: 'bg-purple-200 text-purple-800' }],
        }
    },
    columns: {
        'm-column-1': { id: 'm-column-1', title: 'To Do', taskIds: ['m-task-1', 'm-task-2'] },
        'm-column-2': { id: 'm-column-2', title: 'Done', taskIds: [] },
    },
    columnOrder: ['m-column-1', 'm-column-2'],
  },
  'Mobile App Redesign': {
    projectUsers: { 'user-2': allUsers[1] },
    members: { 'user-2': 'Admin' },
    tasks: {},
    columns: {
      'ma-column-1': { id: 'ma-column-1', title: 'Backlog', taskIds: [] },
      'ma-column-2': { id: 'ma-column-2', title: 'In Progress', taskIds: [] },
      'ma-column-3': { id: 'ma-column-3', title: 'Done', taskIds: [] },
    },
    columnOrder: ['ma-column-1', 'ma-column-2', 'ma-column-3'],
  }
};