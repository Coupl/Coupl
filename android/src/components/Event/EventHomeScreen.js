
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import selectCurrentEvent from '../../redux/selectors';

const EventHomeScreen = ({ navigation }) => {

    const currentEvent = useSelector(selectCurrentEvent);
    const eventInfo = currentEvent.eventInfo;
    
    const store = useStore();

    const leaveEvent = () => {
        const leaveEventAction = allActions.eventActions.leaveEvent;
        store.dispatch(leaveEventAction());
        navigation.navigate('UserTabs');
    }

    const startMatching = () => {
        const startMatchingAction = allActions.eventActions.startMatching;
        store.dispatch(startMatchingAction());
        navigation.navigate('MatchingScreen');
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                //Disable the back button usage
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <>
            <Text>
                Event name: {eventInfo.eventName}
            </Text>
            <Text>
                {eventInfo.eventDescription}
            </Text>
                
            <Text>
                Number of participants: {eventInfo.numParticipants}
            </Text>
            <Text>
                Event ending time: {eventInfo.eventFinishTime}
            </Text>

            <Button
                mode="contained"
                onPress={() => startMatching()}
            >
                Start Matching
            </Button>
            <Button
                mode="contained"
                onPress={() => leaveEvent()}
            >
                Leave the Event
            </Button>
        </>
    );
};

export default EventHomeScreen;
