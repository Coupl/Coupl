
import React from 'react';
import {
    Text,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useStore } from 'react-redux';
import allActions from '../../redux/actions';
import axios from 'axios'

const HomeScreen = ({ navigation }) => {

    const store = useStore();
    const joinEventAction = allActions.eventActions.joinEvent;

    const joinEvent = (eventId) => {
        axios.get('getEvent?event_id=' + eventId).then((res) => {
            var eventInfo = res.data;
            eventInfo.numParticipants = 25; //Add this to the actual response later
            store.dispatch(joinEventAction(eventInfo));
            navigation.navigate('EventNavigation');
        }).catch((err) => {
            console.log(err.response);
        });
    }

    return (
        <>
            <Text>Burası ana ekran, analiz raporundaki ui resimlerine göre sadece qr code tarama şeyi olacak</Text>
            <Button
                mode="contained"
                onPress={() => joinEvent(7)}
            >
                Test için rastgele evente girme tuşu
            </Button>
        </>
    );
};

export default HomeScreen;
