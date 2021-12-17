
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventHomeScreen from './EventHomeScreen';
import MatchingScreen from './MatchingScreen';

const EventNavigation = ({ navigation }) => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="EventHomeScreen" component={EventHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MatchingScreen" component={MatchingScreen} options={{ title: "Matching Screen" }} />
        </Stack.Navigator>
    );
};

export default EventNavigation;
