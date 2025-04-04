import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack, usePathname, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from './stores/authStore';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  const pathname = usePathname();
  const segments = useSegments();
  
  useEffect(() => {
    async function prepare() {
      try {
        // Check if user is authenticated on app startup
        await checkAuth();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        // Hide the splash screen
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!appIsReady || isLoading) return;
    
    const inAuthGroup = segments[0] === 'auth';
    
    console.log('Auth navigation check:', { 
      isAuthenticated, 
      inAuthGroup, 
      pathname,
      segments 
    });
    
    if (isAuthenticated === true) {
      // Redirect to tabs if authenticated but in auth group
      if (inAuthGroup) {
        console.log('Authenticated user in auth group, redirecting to tabs');
        router.replace('/(tabs)');
      }
    } else {
      // Redirect to login if not authenticated and not in auth group
      if (!inAuthGroup) {
        console.log('Unauthenticated user not in auth group, redirecting to login');
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, segments, appIsReady, isLoading]);

  // Debug logs
  console.log('Rendering layout with auth state:', isAuthenticated);
  console.log('Current path:', pathname);
  console.log('Current segments:', segments);
  console.log('App is ready:', appIsReady);
  console.log('Auth is loading:', isLoading);
  
  // Show loading screen while preparing app
  if (!appIsReady || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated === true ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="projects/[id]/index" options={{ headerShown: false }} />
            <Stack.Screen name="projects/[id]/tasks/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </>
        ) : (
          <>
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          </>
        )}
      </Stack>
    </ThemeProvider>
  );
}