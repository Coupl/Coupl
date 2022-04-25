
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import React, { useCallback } from 'react';
import { BackHandler, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { MatchStates } from '../../redux/reducers/currentEvent';
import { selectCurrentEvent, selectLikedUsers, selectMatch } from '../../redux/selectors';
import EventPhotoSwiper from './EventPhotoSwiper';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const EventHomeScreen = ({ navigation }) => {

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

    const currentEvent = useSelector(selectCurrentEvent);
    const eventInfo = currentEvent.eventInfo;

    if (!eventInfo) {
        return <div>Loading...</div>
    }

    const store = useStore();
    const likedUsers = useSelector(selectLikedUsers);
    const match = useSelector(selectMatch);

    const leaveEvent = () => {
        const leaveEventAction = allActions.eventActions.leaveEvent;

        const postBody = {
            event_id: eventInfo.id
        };

        axios.post('leaveEvent/', postBody).then((res) => {
            console.log(res);
            navigation.navigate('UserTabs');    
            store.dispatch(leaveEventAction());
        }).catch((err) => {
            console.log(err.response);
        });
    }

    const startMatching = () => {
        const startMatchingAction = allActions.eventActions.startMatching;
        store.dispatch(startMatchingAction());
        navigation.navigate('MatchingScreen');
    }

    const seeCurrentMatch = () => {
        navigation.navigate('FoundMatchScreen');
    }

    const matchIsFinalized = match && (match.yourAcceptance === MatchStates.ACCEPTED && match.theirAcceptance === MatchStates.ACCEPTED);
    const renderMatchIsFinalizedText = () => {
        return (
            <Text style={{ marginBottom: 30 }}>Your match with {match.user.name.first} is already finalized.</Text>
        );
    }

    const remainingTime = moment(eventInfo.event_finish_time, 'YYYY-MM-DD').fromNow();
    const numParticipants = eventInfo.event_attendees.length;
    const numLikes = likedUsers.length;

    return (
        <ScrollView style={{ flex: 1 }}>
            <EventPhotoSwiper event={eventInfo} />
            <View style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                    {eventInfo.event_tags.map((tag, index) => {
                        return (
                            <AntDesign key={index} name="slack-square" size={28}
                                style={styles.icon}
                                color={'#000'}
                            >
                                <Text style={styles.text}>{tag.tag_name}</Text>
                            </AntDesign>
                        )
                    })}
                </View>

                <View style={{
                    alignItems: 'center',
                }}>

                    <AntDesign name="dashboard" size={28}
                        style={styles.icon}
                        color={'#000'}
                    >
                        <Text style={styles.text}> Event ends {remainingTime}</Text>
                    </AntDesign>

                    <AntDesign name="user" size={28}
                        style={styles.icon}
                        color={'#000'}
                    >
                        <Text style={styles.text}> Number of participants: {numParticipants}</Text>
                    </AntDesign>

                    <AntDesign name="heart" size={28}
                        style={styles.icon}
                        color={'#000'}
                    >
                        <Text style={styles.text}> Number of likes: {numLikes}</Text>
                    </AntDesign>

                    {
                        matchIsFinalized ?
                            renderMatchIsFinalizedText() :
                            <Button
                                style={styles.startMatchingButton}
                                mode="contained"
                                onPress={() => startMatching()}
                            >
                                Start Matching
                            </Button>
                    }

                    {
                        match &&
                        <Button
                            style={styles.seeCurrentMatchButton}
                            mode="contained"
                            onPress={() => seeCurrentMatch()}
                        >
                            See Current Match
                        </Button>
                    }

                    <Button
                        style={styles.leaveEventButton}
                        mode="contained"
                        onPress={() => leaveEvent()}
                    >
                        Leave the Event
                    </Button>

                </View>
            </View>
        </ScrollView>
    );
};

export default EventHomeScreen;

const styles = StyleSheet.create({
    description: {
        paddingTop: 10,
        padding: 10,
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'justify',
    },
    icon: {
        padding: 10,
    },
    text: {
        fontSize: 18,
    },
    image: {
        marginTop: -height * 0.03,
        width: width,
        height: height * 0.4,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        resizeMode: 'contain',
    },
    background: {
        paddingTop: 20,
    },
    startMatchingButton: {
        width: width * 0.7,
        marginTop: 20,
        marginBottom: 30,
        backgroundColor: "green",
        borderRadius: 20
    },
    seeCurrentMatchButton: {
        width: width * 0.7,
        marginBottom: 30,
        backgroundColor: "green",
        borderRadius: 20
    },
    leaveEventButton: {
        width: width * 0.7,
        backgroundColor: "gray",
        borderRadius: 20
    },
});