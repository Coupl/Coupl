
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EventNavigation from '../Event/EventNavigation';
import HomeScreen from './HomeScreen';
import MessagesScreen from './MessagesScreen';
import ProfileScreen from './ProfileScreen';
import UpcomingEventsScreen from './UpcomingEventsScreen';

const TabsComponent = () => {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator

            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = "ios-information-circle";
                    if (route.name === "HomeScreen") iconName = "home";
                    else if (route.name === "UpcomingEventsScreen") iconName = "calendar";
                    else if (route.name === "MessagesScreen") iconName = "chatbox-ellipses";
                    else if (route.name === "ProfileScreen") iconName = "person";

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tabs.Screen name="HomeScreen" component={HomeScreen} options={{title : "Home"}}/>
            <Tabs.Screen name="UpcomingEventsScreen" component={UpcomingEventsScreen} options={{title : "Upcoming Events"}}/>
            <Tabs.Screen name="MessagesScreen" component={MessagesScreen} options={{title : "Messages"}}/>
            <Tabs.Screen name="ProfileScreen" component={ProfileScreen} options={{title : "Profile"}}/>
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
