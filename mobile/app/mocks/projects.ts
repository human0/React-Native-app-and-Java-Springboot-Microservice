import { users } from './users';

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  createdAt: string; // ISO date string
  createdBy: string; // user ID
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign the company website with updated branding and improved UX.',
    deadline: '2025-05-15T00:00:00Z',
    createdAt: '2025-04-10T00:00:00Z',
    createdBy: users[1].id,
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Build a cross-platform mobile application for client project tracking.',
    deadline: '2025-06-20T00:00:00Z',
    createdAt: '2025-04-05T00:00:00Z',
    createdBy: users[0].id,
  },
  {
    id: '3',
    title: 'Database Migration',
    description: 'Migrate existing database to new cloud infrastructure with zero downtime.',
    deadline: '2025-04-30T00:00:00Z',
    createdAt: '2025-04-01T00:00:00Z',
    createdBy: users[1].id,
  },
];