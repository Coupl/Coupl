
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { BackHandler, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { selectActiveMatch, selectActiveMatchDecision, selectCurrentEvent } from '../../redux/selectors';
import FirebaseImage from '../Common/FirebaseImage';
import EventPhotoSwiper from './EventPhotoSwiper';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const EventHomeScreen = ({ navigation }) => {
    const currentEvent = useSelector(selectCurrentEvent);
    const eventInfo = currentEvent.eventInfo;
    const store = useStore();
    const setActiveMatchAction = allActions.eventActions.setActiveMatch;

    useEffect(() => {
        const intervalId = setInterval(() => {

            const postBody = {
                event_id: eventInfo.id
            }
            axios.post('getActiveLikes/', postBody).then((res) => {
                const newActiveMatch = res.data;

                //If there is no change, do not call dispatch
                if (JSON.stringify(newActiveMatch) !== JSON.stringify(currentEvent.activeMatch)) {
                    store.dispatch(setActiveMatchAction(res.data));
                }
            }).catch((err) => {
            })

        }, 10000);

        return () => clearInterval(intervalId);
    }, [currentEvent]);

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

    if (!eventInfo) {
        return <div>Loading...</div>
    }

    const match = useSelector(selectActiveMatch);
    const decision = useSelector(selectActiveMatchDecision);

    const leaveEvent = () => {
        const leaveEventAction = allActions.eventActions.leaveEvent;

        const postBody = {
            event_id: eventInfo.id
        };

        axios.post('leaveEvent/', postBody).then((res) => {
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

    const renderActiveMatch = () => {
        if (!match) return;

        const matchPhoto = match.profile_pictures[0].url;

        return (
            <TouchableOpacity
                style={{ flex: 1, flexDirection: "row", padding: 10, marginBottom: 5, borderWidth: 2, borderRadius: 20 }}
                onPress={() => navigation.navigate("FoundMatchScreen")}
            >

                <View style={{ padding: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>Active match:</Text>
                </View>
                <FirebaseImage imageName={matchPhoto} style={{ width: 50, height: 50 }}></FirebaseImage>
                <View style={{ padding: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>{match.name} {match.surname}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    const remainingTime = moment(eventInfo.event_finish_time, 'YYYY-MM-DD').fromNow();
    const numParticipants = eventInfo.event_attendees.length;
    const numLikes = 0; //TODO: maybe get this from backend, or just remove

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
                        match ?
                            renderActiveMatch() :
                            <Button
                                style={styles.startMatchingButton}
                                mode="contained"
                                onPress={() => startMatching()}
                            >
                                Start Matching
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