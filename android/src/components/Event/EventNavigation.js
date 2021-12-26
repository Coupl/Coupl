
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventHomeScreen from './EventHomeScreen';
import MatchingScreen from './MatchingScreen';
import FoundMatchScreen from './FoundMatchScreen';

const EventNavigation = ({ navigation }) => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="EventHomeScreen" component={EventHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MatchingScreen" component={MatchingScreen} options={{ title: "Matching Screen" }} />
            <Stack.Screen name="FoundMatchScreen" component={FoundMatchScreen} options={{ title: "Found a Match" }} />
        </Stack.Navigator>
    );
};

export default EventNavigation;
