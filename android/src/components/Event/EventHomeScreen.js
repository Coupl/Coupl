
import React from 'react';
import { Button } from 'react-native-paper';

const EventHomeScreen = ({ navigation }) => {

    return (
        <>
            <Button
                mode="contained"
                onPress={() => navigation.navigate('MatchingScreen')}
            >
                Start Matching
            </Button>
            <Button
                mode="contained"
                onPress={() => navigation.navigate('UserTabs') }
            >
                Leave the Event
            </Button>
        </>
    );
};

export default EventHomeScreen;
