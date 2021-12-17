
import React from 'react';
import {
    Button,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import UpcomingEventsScreen from './UpcomingEventsScreen';
import MessagesScreen from './MessagesScreen';
import ProfileScreen from './ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventNavigation from '../Event/EventNavigation';

const TabsComponent = () => {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator>
            <Tabs.Screen name="HomeScreen" component={HomeScreen} />
            <Tabs.Screen name="UpcomingEventsScreen" component={UpcomingEventsScreen} />
            <Tabs.Screen name="MessagesScreen" component={MessagesScreen} />
            <Tabs.Screen name="ProfileScreen" component={ProfileScreen} />
        </Tabs.Navigator>
    );
}

const UserNavigation = ({ navigation }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="UserTabs" component={TabsComponent} options={{ headerShown: false }} />
            <Stack.Screen name="EventNavigation" component={EventNavigation} options={{ headerShown: false }} />
        </Stack.Navigator>

        
    );
};

export default UserNavigation;
