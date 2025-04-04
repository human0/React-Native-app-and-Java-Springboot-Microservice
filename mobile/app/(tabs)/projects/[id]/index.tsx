import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getProjectById, deleteProject, getProjectStats } from '@/app/api/projects';
import { getProjectTasks } from '@/app/api/tasks';
import { Project } from '@/app/mocks/projects';
import { Task } from '@/app/mocks/tasks';
import TaskCard from '@/app/components/task/TaskCard';
import { useAuthStore } from '@/app/stores/authStore';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, progress: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  
  useEffect(() => {
    loadProjectDetails();
  }, [id]);
  
  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(id);
      const projectTasks = await getProjectTasks(id);
      const projectStats = await getProjectStats(id);
      
      setProject(projectData);
      setTasks(projectTasks);
      setStats(projectStats);
    } catch (error) {
      console.error('Failed to load project details:', error);
      Alert.alert('Error', 'Failed to load project details');
      router.back();
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProject = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteProject(id);
              router.replace('/(tabs)/projects/index');
            } catch (error) {
              console.error('Failed to delete project:', error);
              Alert.alert('Error', 'Failed to delete project');
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const canEditProject = user?.role === 'Admin' || user?.role === 'Project Manager';
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4898f0" />
      </View>
    );
  }
  
  if (!project) {
    return null;
  }
  
  const deadline = new Date(project.deadline);
  const isOverdue = deadline < new Date();
  
  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === 'To Do');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const doneTasks = tasks.filter(task => task.status === 'Done');
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          {canEditProject && (
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionButton}
                // onPress={() => router.push(`/projects/${id}/edit`)}
              >
                <Ionicons name="create-outline" size={22} color="#4898f0" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeleteProject}
              >
                <Ionicons name="trash-outline" size={22} color="#f43f5e" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.projectInfo}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          
          <View style={styles.projectMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.metaText}>
                Due {format(deadline, 'MMM d, yyyy')}
              </Text>
            </View>
            
            <View style={[
              styles.statusBadge,
              isOverdue ? styles.overdue : 
                stats.progress === 100 ? styles.completed : styles.ongoing
            ]}>
              <Text style={styles.statusText}>
                {isOverdue 
                  ? 'Overdue' 
                  : stats.progress === 100 
                    ? 'Completed' 
                    : 'In Progress'
                }
              </Text>
            </View>
          </View>
          
          <Text style={styles.description}>{project.description}</Text>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(stats.progress)}%</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[styles.progressBar, { width: `${stats.progress}%` }]} 
              />
            </View>
            
            <Text style={styles.progressStats}>
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </Text>
          </View>
        </View>
        
        <View style={styles.tasksSection}>
          <View style={styles.tasksSectionHeader}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            {canEditProject && (
              <TouchableOpacity 
                style={styles.addTaskButton}
                // onPress={() => router.push(`/projects/${id}/tasks/create`)}
              >
                <Text style={styles.addTaskText}>Add Task</Text>
                <Ionicons name="add-circle-outline" size={20} color="#4898f0" />
              </TouchableOpacity>
            )}
          </View>
          
          {tasks.length === 0 ? (
            <View style={styles.emptyTasks}>
              <Ionicons name="checkmark-circle-outline" size={48} color="#ccc" />
              <Text style={styles.emptyTasksText}>No tasks yet</Text>
              {canEditProject && (
                <TouchableOpacity 
                  style={styles.emptyTasksButton}
                  // onPress={() => router.push(`/projects/${id}/tasks/create`)}
                >
                  <Text style={styles.emptyTasksButtonText}>Create a task</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {todoTasks.length > 0 && (
                <View style={styles.taskGroup}>
                  <Text style={styles.taskGroupTitle}>To Do</Text>
                  {todoTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </View>
              )}
              
              {inProgressTasks.length > 0 && (
                <View style={styles.taskGroup}>
                  <Text style={styles.taskGroupTitle}>In Progress</Text>
                  {inProgressTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </View>
              )}
              
              {doneTasks.length > 0 && (
                <View style={styles.taskGroup}>
                  <Text style={styles.taskGroupTitle}>Done</Text>
                  {doneTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 16,
  },
  projectInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ongoing: {
    backgroundColor: '#e0f2fe',
  },
  completed: {
    backgroundColor: '#dcfce7',
  },
  overdue: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4898f0',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4898f0',
  },
  progressStats: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  tasksSection: {
    margin: 16,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTaskText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4898f0',
    marginRight: 4,
  },
  emptyTasks: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyTasksText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 12,
  },
  emptyTasksButton: {
    marginTop: 20,
    backgroundColor: '#4898f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyTasksButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  taskGroup: {
    marginBottom: 24,
  },
  taskGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
});