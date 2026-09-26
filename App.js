import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { OrdersProvider } from './src/context/OrdersContext';
import { APP_CONFIG } from './src/config/appConfig';
import HomeScreen from './src/screens/HomeScreen';
import AiAssistantScreen from './src/screens/AiAssistantScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OrdersScreen from './src/screens/OrdersScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#007AFF',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: 'Артқа',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: APP_CONFIG.current.appName,   // ✅ Тақырыпқа байланысты
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{ title: APP_CONFIG.current.itemNamePlural }}   // ✅
        />
        <Stack.Screen
          name="AiAssistant"
          component={AiAssistantScreen}
          options={{ title: 'AI Көмекші' }}
        />
        <Stack.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{ title: 'Аналитика' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Профиль' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <OrdersProvider>
          <AppNavigator />
        </OrdersProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}