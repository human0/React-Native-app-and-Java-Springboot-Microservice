import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { getProjectStats } from '../../api/projects';
import { Project } from '../../mocks/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [stats, setStats] = React.useState({ totalTasks: 0, completedTasks: 0, progress: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStats() {
      try {
        const projectStats = await getProjectStats(project.id);
        setStats(projectStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadStats();
  }, [project.id]);
  
  const deadline = new Date(project.deadline);
  const daysRemaining = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const navigateToProject = () => {
    router.push(`/projects/${project.id}`);
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={navigateToProject}>
      <View style={styles.header}>
        <Text style={styles.title}>{project.title}</Text>
        <View style={[
          styles.deadline, 
          daysRemaining < 0 ? styles.overdue : 
          daysRemaining < 7 ? styles.urgent : 
          styles.onTrack
        ]}>
          <Text style={styles.deadlineText}>
            {daysRemaining < 0 
              ? 'Overdue' 
              : daysRemaining === 0 
                ? 'Due today' 
                : `Due in ${daysRemaining} days`
            }
          </Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {project.description}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.stats}>
          {loading 
            ? 'Loading...' 
            : `${stats.completedTasks}/${stats.totalTasks} tasks`
          }
        </Text>
        <Text style={styles.completion}>
          {loading ? '' : `${Math.round(stats.progress)}% complete`}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${stats.progress}%` }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  deadline: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  onTrack: {
    backgroundColor: '#e6f7f0',
  },
  urgent: {
    backgroundColor: '#fff3e0',
  },
  overdue: {
    backgroundColor: '#fee2e2',
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stats: {
    fontSize: 12,
    color: '#666',
  },
  completion: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4898f0',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4898f0',
  },
});