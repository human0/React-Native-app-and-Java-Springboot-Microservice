import { currentUser, users } from '../mocks/users';

export async function getCurrentUser() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return currentUser;
}

export async function getUsers() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return users;
}

export async function getUserById(id: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  const user = users.find(u => u.id === id);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}