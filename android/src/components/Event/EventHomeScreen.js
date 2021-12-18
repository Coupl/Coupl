
import React from 'react';
import { Button, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import selectCurrentEvent from '../../redux/selectors';

const EventHomeScreen = ({ navigation }) => {

    const currentEvent = useSelector(selectCurrentEvent);
    const eventInfo = currentEvent.eventInfo;
    
    return (
        <>
            <Text>
                Event name: {eventInfo.name}
            </Text>
            <Text>
                Number of participants: {eventInfo.numParticipants}
            </Text>
            <Text>
                Event ending time: {eventInfo.endingTime.toString()}
            </Text>

            <Button
                mode="contained"
                onPress={() => navigation.navigate('MatchingScreen')}
            >
                Start Matching
            </Button>
            <Button
                mode="contained"
                onPress={() => navigation.navigate('UserTabs')}
            >
                Leave the Event
            </Button>
        </>
    );
};

export default EventHomeScreen;
