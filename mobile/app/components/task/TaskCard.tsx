import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Task } from '../../mocks/tasks';
import { getUserById } from '../../api/users';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [assignee, setAssignee] = React.useState({ name: '', email: '' });
  
  React.useEffect(() => {
    async function loadAssignee() {
      try {
        const user = await getUserById(task.assigneeId);
        setAssignee({ name: user.name, email: user.email });
      } catch (error) {
        console.error('Failed to load assignee:', error);
      }
    }
    
    loadAssignee();
  }, [task.assigneeId]);
  
  const getStatusStyles = () => {
    switch (task.status) {
      case 'To Do':
        return { backgroundColor: '#f3f4f6', color: '#374151' };
      case 'In Progress':
        return { backgroundColor: '#e0f2fe', color: '#0369a1' };
      case 'Done':
        return { backgroundColor: '#dcfce7', color: '#15803d' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };
  
  const handlePress = () => {
    router.push(`/projects/${task.projectId}/tasks/${task.id}`);
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusStyles().backgroundColor }]}>
          <Text style={[styles.statusText, { color: getStatusStyles().color }]}>
            {task.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.assignee}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {assignee.name ? assignee.name.charAt(0) : '?'}
            </Text>
          </View>
          <Text style={styles.assigneeName}>{assignee.name || 'Loading...'}</Text>
        </View>
        <Text style={styles.date}>
          Updated {new Date(task.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignee: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4898f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  assigneeName: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});