/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import LandingNavigation from './src/components/Landing/LandingNavigation';
import UserNavigation from './src/components/User/UserNavigation';
import CoordinatorNavigation from './src/components/Coordinator/CoordinatorNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import setupAxios from './src/config/axiosConfig';

const App: () => Node = () => {
  const Stack = createNativeStackNavigator();
  setupAxios();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LandingNavigation"
          component={LandingNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserNavigation"
          component={UserNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CoordinatorNavigation"
          component={CoordinatorNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
