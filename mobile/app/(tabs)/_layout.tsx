import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',  // This sets the tab label
          tabBarLabel: 'Dashboard',  // Adding explicit tabBarLabel
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects/index"
        options={{
          title: 'Projects',  // This sets the tab label
          tabBarLabel: 'Projects',  // Adding explicit tabBarLabel
          headerTitle: 'Projects',  // This sets the header title
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects/[id]/index"
        options={{
          title: 'My Tasks',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="light-mode" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}