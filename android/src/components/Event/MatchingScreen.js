
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { selectCurrentEvent, selectLikedUsers, selectUser } from '../../redux/selectors';
import { meetingLocations } from '../User/data';
import ProfilePhotoSwiper from '../User/ProfilePhotoSwiper';

const UserCard = ({ currentUser, candidateInfo, likeCandidate, skipCandidate }) => {
    const hobbies = candidateInfo.hobbies;

    const renderSwiperBottom = () => {
        return (
            <View style={{ flexDirection: "row" }}>
                <Button
                    style={{ flex: 1, backgroundColor: 'rgba(218,223,225,0.5)', borderRadius: 30, marginRight: 100 }}
                    icon="heart"
                    onPress={() => likeCandidate(candidateInfo)}>
                    Like
                </Button>
                <Button
                    style={{ flex: 1, backgroundColor: 'rgba(218,223,225,0.5)', borderRadius: 30 }}
                    icon="close"
                    onPress={() => skipCandidate(candidateInfo)}>
                    Skip
                </Button>
            </View>
        )
    }

    return (
        <ScrollView style={[styles.container]}>
            <ProfilePhotoSwiper profile={candidateInfo} renderBottom={renderSwiperBottom} />
            <View style={{ flexDirection: "row", padding: 10 }}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 24 }}>Match Score:</Text>
                    <Text style={{ backgroundColor: "green", color: "white", borderRadius: 100, padding: 2, fontWeight: "bold", alignSelf: 'flex-start', fontSize: 24 }}>21</Text>
                </View>
            </View>
            <ScrollView style={{ padding: 10 }}>

                <View style={{ borderWidth: 1, borderRadius: 20, backgroundColor: "gray" }}>
                    <Text style={{ alignSelf: "center", paddingBottom: 5 }}>Hobbies</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>

                        {hobbies.map((hobby, index) => {

                            const isCommon = currentUser.hobbies.filter((userHobby) => userHobby.title === hobby.title).length > 0;

                            return (
                                <View key={index} style={{ padding: 5 }}>
                                    <View style={{ backgroundColor: 'rgba(218,223,225,0.3)', paddingHorizontal: 10, borderRadius: 25 }}>
                                        <Text style={styles.text}>{hobby.title}</Text>
                                    </View>
                                    {
                                        isCommon &&
                                        <View style={{ position: "absolute", backgroundColor: 'rgba(46,204,113,0.3)', right: -10, borderRadius: 25, transform: [{ rotate: '30deg' }] }}>
                                            <Text style={{ fontSize: 10 }}> Common </Text>
                                        </View>
                                    }
                                </View>
                            )
                        })}
                    </View>
                </View>
            </ScrollView>
            <View style={{ flexDirection: "row", padding: 10 }}>
                <Button style={{ flex: 1 }} icon="heart" onPress={() => likeCandidate(candidateInfo)}>Like</Button>
                <Button style={{ flex: 1 }} icon="close" onPress={() => skipCandidate(candidateInfo)}>Skip</Button>
            </View>
        </ScrollView>
    );
}

const LOADING = 1;
const NO_CANDIDATE = 2;

const MatchingScreen = ({ navigation }) => {

    const [currentCandidate, setCurrentCandidate] = useState(LOADING);
    const [numCandidates, setNumCandidates] = useState("?");
    const store = useStore();
    const likedUsers = useSelector(selectLikedUsers);
    const user = useSelector(selectUser);
    const event = useSelector(selectCurrentEvent);

    const fetchNewCandidate = () => {
        setCurrentCandidate(LOADING);

        const postBody = {
            event_id: event.eventInfo.id,
            user_id: user.userId
        }

        axios.post("getMatchList/", postBody).then((res) => {
            const candidates = res.data;
            setNumCandidates(candidates.length);

            if (candidates.length === 0) {
                setCurrentCandidate(NO_CANDIDATE);
                return;
            }

            axios.post("getBestMatch/", postBody).then((res) => {
                setCurrentCandidate(res.data)
            }).catch((err) => {
                console.log(err.response.data);
            });

        }).catch((err) => {
            console.log(err.response.data);
        });

    };

    useEffect(() => {
        fetchNewCandidate();
    }, []);

    useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                const stopMatchingAction = allActions.eventActions.stopMatching;
                store.dispatch(stopMatchingAction());
            }),
        [navigation]
    );

    const checkMatch = () => {
        const foundMatch = false;
        if (foundMatch) {
            const matchUser = currentCandidate;
            const matchLocation = meetingLocations.sort(() => 0.5 - Math.random())[0];
            const foundMatchAction = allActions.eventActions.foundMatch;

            const match = {
                user: matchUser,
                location: matchLocation
            }

            store.dispatch(foundMatchAction(match));
            navigation.navigate('FoundMatchScreen');
        }
    }

    const likeCandidate = (candidate) => {
        const likeUserAction = allActions.eventActions.likeUser;

        const likeInformation = {
            event_id: event.eventInfo.id,
            liker_id: user.userId,
            liked_id: candidate.user.pk
        }

        axios.post("likeUser/", likeInformation).then((res) => {
            store.dispatch(likeUserAction(candidate));
            checkMatch();
            fetchNewCandidate();
        }).catch((err) => {
            console.log(err);
        })
    }
    const skipCandidate = (candidate) => {
        const skipUserAction = allActions.eventActions.skipUser;
        store.dispatch(skipUserAction(candidate));
        checkMatch();
        fetchNewCandidate();
    }

    if (currentCandidate === LOADING) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={200} color="#0000ff" />
            </View>
        )
    }

    if (currentCandidate === NO_CANDIDATE) {
        return (
            <View style={styles.container}>
                <Text>No possible matches left.</Text>
            </View>
        )
    }


    return (
        <>
            <View style={{ marginHorizontal: 10, marginTop: 5, borderWidth: 2, borderColor: "gray", borderRadius: 5 }}>
                <Text style={{ alignSelf: "center" }}>There are {numCandidates} possible matches.</Text>
            </View>
            <UserCard currentUser={user} candidateInfo={currentCandidate} likeCandidate={likeCandidate} skipCandidate={skipCandidate} />
        </>
    );
};

export default MatchingScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        margin: 10,
        borderColor: "gray",
        backgroundColor: "#DCDCDC",
        borderWidth: 2,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50
    },
    innerContainer: {
        margin: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: "100%",
        flex: 1,
    },
    logo: {
        width: "80%",
        height: "20%",
        resizeMode: 'contain',
    },
    button: {
        margin: 10,
        width: 150,
        height: 40,
        borderRadius: 20,
    },
    textInput: {
        margin: 5,
        width: 200,
        height: 60,
    },
    icon: {
        padding: 10,
    },
    text: {
        fontSize: 18,
    },
});
