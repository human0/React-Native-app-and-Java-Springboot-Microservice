import { tasks, TaskStatus } from '../mocks/tasks';

export async function getProjectTasks(projectId: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return tasks.filter(t => t.projectId === projectId);
}

export async function getTaskById(id: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    throw new Error('Task not found');
  }
  
  return task;
}

export async function createTask(
  projectId: string, 
  taskData: { title: string; description: string; assigneeId: string; status: TaskStatus }
) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newTask = {
    ...taskData,
    id: Math.random().toString(36).substring(2, 11),
    projectId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  return newTask;
}

export async function updateTask(id: string, taskData: Partial<Omit<typeof tasks[0], 'id' | 'projectId' | 'createdAt'>>) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  tasks[index] = {
    ...tasks[index],
    ...taskData,
    updatedAt: new Date().toISOString(),
  };
  
  return tasks[index];
}

export async function deleteTask(id: string) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  tasks.splice(index, 1);
  return { success: true };
}

export async function getUserAssignedTasks(userId: string) {
  await new Promise(resolve => setTimeout(resolve, 400));
  return tasks.filter(t => t.assigneeId === userId);
}