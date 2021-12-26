
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { BackHandler, Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { selectCurrentEvent, selectLikedUsers, selectMatch } from '../../redux/selectors';
import { data } from "./../User/data";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from 'moment';
import { MatchStates } from '../../redux/reducers/currentEvent';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const EventHomeScreen = ({ navigation }) => {

    const currentEvent = useSelector(selectCurrentEvent);
    //const eventInfo = currentEvent.eventInfo;
    const eventInfo = data[0];
    const store = useStore();
    const likedUsers = useSelector(selectLikedUsers);
    const match = useSelector(selectMatch);

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

    const seeCurrentMatch = () => {
        navigation.navigate('FoundMatchScreen');
    }

    const matchIsFinalized = match && (match.yourAcceptance === MatchStates.ACCEPTED && match.theirAcceptance === MatchStates.ACCEPTED);
    const renderMatchIsFinalizedText = () => {
        return (
            <Text style={{marginBottom: 30}}>Your match with {match.user.name.first} is already finalized.</Text>
        );
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

    const eventEndTime = moment().endOf('hour').fromNow();
    const numParticipants = 25;
    const numLikes = likedUsers.length;

    return (
        <View style={{ flex: 1 }}>
            <Image style={styles.image} source={{ uri: eventInfo.eventImage }} />
            <View style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                    {eventInfo.tags.map((tag, index) => {
                        return (
                            <AntDesign key={index} name="slack-square" size={28}
                                style={styles.icon}
                                color={'#000'}
                            >
                                <Text style={styles.text}>{tag}</Text>
                            </AntDesign>
                        )
                    })}
                </View>

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>

                    <AntDesign name="dashboard" size={28}
                        style={styles.icon}
                        color={'#000'}
                    >
                        <Text style={styles.text}> Event ends {eventEndTime}</Text>
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
        </View>
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
        position: 'absolute',
        width,
        height,
        transform: [{ translateY: height * 0.3 }],
        backgroundColor: '#fff',
        borderRadius: 32
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