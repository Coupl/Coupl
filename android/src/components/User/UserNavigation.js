
import React from 'react';
import {
    Button,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import UpcomingEventsScreen from './UpcomingEventsScreen';
import MessagesScreen from './MessagesScreen';
import ProfileScreen from './ProfileScreen';


const UserNavigation = ({ navigation }) => {

    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator>
          <Tabs.Screen name="HomeScreen" component={HomeScreen} />
          <Tabs.Screen name="UpcomingEventsScreen" component={UpcomingEventsScreen} />
          <Tabs.Screen name="MessagesScreen" component={MessagesScreen} />
          <Tabs.Screen name="ProfileScreen" component={ProfileScreen} />
        </Tabs.Navigator>
    );
};

export default UserNavigation;
