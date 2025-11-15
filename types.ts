export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
}

export interface Comment {
  id:string;
  userId: string;
  content: string;
  timestamp: string;
}

export type TaskStatus = 'Backlog' | 'In Progress' | 'Blocked' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignees: string[];
  tags: { name: string; color: string }[];
  status: TaskStatus;
  dueDate?: string;
  comments?: Comment[];
}

export interface ColumnData {
  id: string;
  title: string;
  taskIds: string[];
}

export type Role = 'Admin' | 'Member';

export interface ProjectData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: ColumnData };
  columnOrder: string[];
  projectUsers: { [key: string]: User };
  members: { [userId: string]: Role };
}

export interface AllProjectsData {
  [projectName: string]: ProjectData;
}