
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { BackHandler,  Alert, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EventNavigation from '../Event/EventNavigation';
import AttendedEventsScreen from './AttendedEventsScreen';
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
                    else if (route.name === "AttendedEventsScreen") iconName = "file-tray-outline";
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
            <Tabs.Screen name="AttendedEventsScreen" component={AttendedEventsScreen} options={{title : "Attended Events"}}/>
            <Tabs.Screen name="MessagesScreen" component={MessagesScreen} options={{title : "Messages"}}/>
            <Tabs.Screen name="ProfileScreen" component={ProfileScreen} options={{title : "Profile"}}/>
        </Tabs.Navigator>
    );
}

const UserNavigation = ({ navigation }) => {
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

                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <Stack.Navigator>
            <Stack.Screen name="UserTabs" component={TabsComponent} options={{ headerShown: false }} />
            <Stack.Screen name="EventNavigation" component={EventNavigation} options={{ headerShown: false }} />
        </Stack.Navigator>


    );
};

export default UserNavigation;
