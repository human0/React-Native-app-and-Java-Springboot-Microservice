import { projects } from '../mocks/projects';
import { Task, tasks } from '../mocks/tasks';

export async function getProjects() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return projects;
}

export async function getProjectById(id: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  const project = projects.find(p => p.id === id);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  return project;
}

export async function createProject(projectData: Omit<typeof projects[0], 'id' | 'createdAt'>) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newProject = {
    ...projectData,
    id: Math.random().toString(36).substring(2, 11),
    createdAt: new Date().toISOString(),
  };
  
  projects.push(newProject);
  return newProject;
}

export async function updateProject(id: string, projectData: Partial<Omit<typeof projects[0], 'id' | 'createdAt'>>) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Project not found');
  }
  
  projects[index] = {
    ...projects[index],
    ...projectData,
  };
  
  return projects[index];
}

export async function deleteProject(id: string) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Project not found');
  }
  
  projects.splice(index, 1);
  
  // Delete all tasks associated with this project
  const projectTasks = tasks.filter(t => t.projectId === id);
  projectTasks.forEach(task => {
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
    }
  });
  
  return { success: true };
}

export async function getProjectStats(id: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const projectTasks = tasks.filter(t => t.projectId === id);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
  
  return {
    totalTasks,
    completedTasks,
    progress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  };
}