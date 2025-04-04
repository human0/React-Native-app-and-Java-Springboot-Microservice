export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Project Manager' | 'Developer';
}

export const users: User[] = [
    {
        id: '1',
        name: 'John Admin',
        email: 'admin@example.com',
        role: 'Admin',
    },
    {
        id: '2',
        name: 'Sarah Manager',
        email: 'manager@example.com',
        role: 'Project Manager',
    },
    {
        id: '3',
        name: 'David Developer',
        email: 'dev@example.com',
        role: 'Developer',
    },
];

export const currentUser: User = users[0];