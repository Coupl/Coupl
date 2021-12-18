
import React from 'react';
import {
    Text,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useStore } from 'react-redux';
import allActions from '../../redux/actions';

const HomeScreen = ({ navigation }) => {

    const store = useStore();
    const joinEventAction = allActions.eventActions.joinEvent;

    const joinEvent = (eventId) => {
        //TODO: Join the event and fetch the event details here
        const eventInfo = {
            name: "Rastgele bir etkinlik",
            numParticipants: 25,
            endingTime: new Date()
        }
        
        store.dispatch(joinEventAction(eventInfo));
        navigation.navigate('EventNavigation')
    }

    return (
        <>
            <Text>Burası ana ekran, analiz raporundaki ui resimlerine göre sadece qr code tarama şeyi olacak</Text>
            <Button
                mode="contained"
                onPress={() => joinEvent(1)}
            >
                Test için rastgele evente girme tuşu
            </Button>
        </>
    );
};

export default HomeScreen;
