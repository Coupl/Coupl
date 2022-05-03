
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Badge, Button, Divider, Text } from 'react-native-paper';
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { selectCurrentEvent, selectUser } from '../../redux/selectors';
import { meetingLocations } from '../User/data';
import ProfilePhotoSwiper from '../User/ProfilePhotoSwiper';
import Popover from 'react-native-popover-view';
import Collapsible from 'react-native-collapsible';
import * as Progress from 'react-native-progress';

const circleColor = (percentage) => {
    if (percentage < 0.33) return "red";
    else if (percentage < 0.67) return "orange";
    else return "green";
}

const UserCard = ({ currentUser, candidateProfile, candidateInfo, likeCandidate, skipCandidate }) => {
    const hobbies = candidateProfile.hobbies;
    const commonEvents = candidateInfo.common_events.slice(0, 5).map((event) => event.event_name).join(", ");
    const commonTags = candidateInfo.common_event_tags.slice(0, 3);
    const commonLocations = candidateInfo.common_event_locations.slice(0, 3);
    const matchScores = candidateInfo.match_scores;
    const [isCollapsed, setCollapsed] = useState(true);

    const [progress, setProgress] = useState(true);

    useEffect(() => { setProgress(matchScores); }, []);

    const renderSwiperBottom = () => {
        return (
            <View style={{ flexDirection: "row" }}>
                <Button
                    style={{ flex: 1, backgroundColor: 'rgba(218,223,225,0.5)', borderRadius: 30 }}
                    icon="heart"
                    onPress={() => likeCandidate(candidateProfile)}>
                    Like
                </Button>
                <Popover
                    from={(
                        <TouchableOpacity style={{ marginHorizontal: 10, backgroundColor: "white", borderRadius: 100 }}>
                            <Progress.Circle color={circleColor(progress.total_score)} animated={false} showsText={true} textStyle={{ fontSize: 13 }} progress={progress.total_score} size={40} />
                        </TouchableOpacity>
                    )}>
                    <View style={{ padding: 10 }}>
                        <View style={{ flex: 1, paddingVertical : 5,flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                            <Text>Hobbies: </Text>
                            <Progress.Circle color={circleColor(progress.hobbies_score)} animated={false} showsText={true} textStyle={{ fontSize: 13 }} progress={progress.hobbies_score} size={40} />
                        </View>

                        <View style={{ flex: 1, paddingVertical : 5, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                            <Text>Event types: </Text>
                            <Progress.Circle color={circleColor(progress.tags_score)} animated={false} showsText={true} textStyle={{ fontSize: 13 }} progress={progress.tags_score} size={40} />
                        </View>

                        <View style={{ flex: 1, paddingVertical : 5, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                            <Text>Past matches: </Text>
                            <Progress.Circle color={circleColor(progress.past_matches_score)} animated={false} showsText={true} textStyle={{ fontSize: 13 }} progress={progress.past_matches_score} size={40} />
                        </View>


                    </View>
                </Popover>

                <Button
                    style={{ flex: 1, backgroundColor: 'rgba(218,223,225,0.5)', borderRadius: 30 }}
                    icon="close"
                    onPress={() => skipCandidate(candidateProfile)}>
                    Skip
                </Button>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{ overflow: "hidden", borderRadius: 50 }}>
                <ProfilePhotoSwiper profile={candidateProfile} renderBottom={renderSwiperBottom} />
            </View>

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row", borderColor: "gray", backgroundColor: "#DCDCDC", borderWidth: 2, borderRadius: 20, margin: 5 }}>
                <Text style={{ fontSize: 20, padding: 5 }}>{candidateProfile.description}</Text>
            </View>

            <ScrollView style={{ padding: 10 }}>
                {
                    hobbies.length > 0 &&

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
                }

                <TouchableOpacity style={{ flex: 1, alignItems: "center", borderColor: "gray", backgroundColor: 'rgba(46,204,113,0.3)', borderWidth: 2, borderRadius: 10, margin: 5 }} onPress={() => { setCollapsed(!isCollapsed) }}>
                    <Text style={{ padding: 5, fontSize: 20 }}>Your Common Activities</Text>
                    <Collapsible collapsed={isCollapsed}>
                        {
                            commonEvents.length > 0 &&
                            <View style={{ borderRadius: 20, paddingHorizontal: 10, marginVertical: 5, paddingVertical: 5, backgroundColor: "rgba(181, 101, 167, 0.6)" }}>
                                <Text>Attended {commonEvents} together.</Text>
                            </View>
                        }
                        <Divider />
                        {
                            commonLocations.length > 0 &&
                            <View>
                                {commonLocations.map((location, index) => {

                                    return (
                                        <View key={index} style={{ borderRadius: 20, marginVertical: 5, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "rgba(0, 155, 119, 0.6)" }}>
                                            <Text>Been to {location.location.name} {location.frequency} {location.frequency === 1 ? "time" : "times"}.</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        }
                        <Divider />
                        {
                            commonTags.length > 0 &&
                            <View>
                                {commonTags.map((tag, index) => {

                                    return (
                                        <View key={index} style={{ borderRadius: 20, marginVertical: 5, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "rgba(91, 94, 166, 0.6)" }}>
                                            <Text>Attended {tag.tag.tag_name} events {tag.frequency} {tag.frequency === 1 ? "time" : "times"}.</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        }
                    </Collapsible>
                </TouchableOpacity>

            </ScrollView>
        </ScrollView>
    );
}

const LOADING = 1;
const NO_CANDIDATE = 2;

const MatchingScreen = ({ navigation }) => {

    const [allCandidates, setAllCandidates] = useState([]);
    const [currentCandidate, setCurrentCandidate] = useState(LOADING);
    const [numCandidates, setNumCandidates] = useState("?");
    const store = useStore();
    const user = useSelector(selectUser);
    const event = useSelector(selectCurrentEvent);
    const setActiveMatchAction = allActions.eventActions.setActiveMatch;

    const checkMatch = () => {
        const postBody = {
            event_id: event.eventInfo.id
        }
        axios.post('getActiveLikes/', postBody).then((res) => {
            const newActiveMatch = res.data;

            //If there is no change, do not call dispatch
            if (JSON.stringify(newActiveMatch) !== JSON.stringify(event.activeMatch)) {
                store.dispatch(setActiveMatchAction(res.data));
            }
        }).catch((err) => {
            fetchNewCandidate();
        })
    }

    const fetchNewCandidate = () => {
        if (numCandidates === 1) {
            setCurrentCandidate(NO_CANDIDATE);
            return;
        }

        const curr = allCandidates.length - numCandidates;
        setNumCandidates(numCandidates - 1);
        setCurrentCandidate(allCandidates[curr + 1]);
    };

    const fetchAllCandidates = () => {
        const postBody = {
            event_id: event.eventInfo.id
        }

        axios.post("getMatchList/", postBody).then((res) => {
            const candidates = res.data;
            setNumCandidates(candidates.length);

            if (candidates.length === 0) {
                setCurrentCandidate(NO_CANDIDATE);
                return;
            }


            setAllCandidates(candidates);
            setCurrentCandidate(candidates[0]);

        }).catch((err) => {
            console.log(err.response.data);
        });
    }

    useEffect(() => {
        fetchAllCandidates();
    }, []);

    useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                const stopMatchingAction = allActions.eventActions.stopMatching;
                store.dispatch(stopMatchingAction());
            }),
        [navigation]
    );


    const likeCandidate = (candidate) => {
        setCurrentCandidate(LOADING);

        const likeInformation = {
            event_id: event.eventInfo.id,
            liked_id: candidate.user.pk
        }

        axios.post("likeUser/", likeInformation).then((res) => {
            checkMatch();
        }).catch((err) => {
            console.log(err);
        })
    }
    const skipCandidate = (candidate) => {
        setCurrentCandidate(LOADING);

        const skipInformation = {
            event_id: event.eventInfo.id,
            skipped_id: candidate.user.pk
        }

        axios.post("skipUser/", skipInformation).then((res) => {
            checkMatch();
        }).catch((err) => {
            console.log(err);
        })
    }

    //If an active match is found, change the screen
    if (event.activeMatch) {
        //Directly navigating during the render causes an error
        setTimeout(() => {
            navigation.replace("FoundMatchScreen"); //replace instead of navigate, so that the back button works properly
        }, 0);
    }

    if (currentCandidate === LOADING) {
        return (
            <View style={{ ...styles.container, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size={200} color="#0000ff" />
                <Text style={{ textAlign: "center", fontSize: 30, padding: 10 }}> Finding the best match for you</Text>
            </View>
        )
    }

    if (currentCandidate === NO_CANDIDATE) {
        return (
            <View style={{ ...styles.container, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30 }}>No possible matches left.</Text>
            </View>
        )
    }

    const { profile: candidateProfile, ...candidateInfo } = currentCandidate;

    return (
        <>
            <View style={{ marginHorizontal: 10, marginTop: 5, borderWidth: 2, borderColor: "gray", borderRadius: 5 }}>
                <Text style={{ alignSelf: "center" }}>There are {numCandidates} possible matches.</Text>
            </View>
            <UserCard currentUser={user} candidateProfile={candidateProfile} candidateInfo={candidateInfo} likeCandidate={likeCandidate} skipCandidate={skipCandidate} />
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
        borderRadius: 50,
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
