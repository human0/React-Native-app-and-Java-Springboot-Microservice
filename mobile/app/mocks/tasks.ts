import { users } from './users';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export const tasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Design Homepage Mockup',
    description: 'Create a new homepage design following the updated brand guidelines.',
    status: 'To Do',
    assigneeId: users[2].id,
    createdAt: '2025-04-11T00:00:00Z',
    updatedAt: '2025-04-11T00:00:00Z',
  },
  {
    id: '2',
    projectId: '1',
    title: 'Implement New Navigation',
    description: 'Develop and test the new responsive navigation menu.',
    status: 'In Progress',
    assigneeId: users[2].id,
    createdAt: '2025-04-12T00:00:00Z',
    updatedAt: '2025-04-14T00:00:00Z',
  },
  {
    id: '3',
    projectId: '2',
    title: 'Create App Wireframes',
    description: 'Design wireframes for all key screens in the mobile app.',
    status: 'Done',
    assigneeId: users[1].id,
    createdAt: '2025-04-06T00:00:00Z',
    updatedAt: '2025-04-09T00:00:00Z',
  },
  {
    id: '4',
    projectId: '3',
    title: 'Backup Current Database',
    description: 'Create a full backup of the current database before migration.',
    status: 'Done',
    assigneeId: users[2].id,
    createdAt: '2025-04-02T00:00:00Z',
    updatedAt: '2025-04-03T00:00:00Z',
  },
];