import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { BackHandler } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EventCreationNavigation from '../Event/EventCreationNavigation';
import CoordinatorPreviousEventsScreen from './CoordinatorPreviousEventsScreen';
import CoordinatorUpcomingEventsScreen from './CoordinatorUpcomingEventsScreen';

const CoordinatorTabsComponent = () => {
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "ios-information-circle";
          if (route.name === "CoordinatorUpcomingEventsScreen") iconName = "calendar";
          else if (route.name === "CoordinatorPreviousEventsScreen") iconName = "file-tray-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="CoordinatorUpcomingEventsScreen" component={CoordinatorUpcomingEventsScreen} options={{ title: "Upcoming Events" }} />
      <Tabs.Screen name="CoordinatorPreviousEventsScreen" component={CoordinatorPreviousEventsScreen} options={{ title: "Previous Events" }} />
    </Tabs.Navigator>
  );
}

const CoordinatorNavigation = ({ navigation }) => {
  const Stack = createNativeStackNavigator();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        
        Alert.alert(
          "Do you want to log out?",
          "",
          [
            {
              text: "Cancel",
              onPress: () => { }
            },
            {
              text: "Log out",
              onPress: () => {
                  navigation.navigate("WelcomeScreen");
              },
              style: "cancel"
            }
          ]
        );
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <Stack.Navigator>
      <Stack.Screen name="CoordinatorTabs" component={CoordinatorTabsComponent} options={{ headerShown: false }} />
      <Stack.Screen name="EventCreationNavigation" component={EventCreationNavigation} options={{ headerShown: true }} />
    </Stack.Navigator>


  );
};

export default CoordinatorNavigation;
