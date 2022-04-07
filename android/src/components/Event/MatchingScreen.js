
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { Animated, Image, StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import AntDesign from "react-native-vector-icons/AntDesign";
import { selectCurrentEvent, selectLikedUsers, selectUser } from '../../redux/selectors';
import { hobbies, meetingLocations } from '../User/data';
import Gallery from 'react-native-image-gallery';
import moment from 'moment';
import { getPhotoURL } from '../../services/firebase/UserPhotos';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const imagePreview = { source: require("./assets/preview.png"), dimensions: { width: 512, height: 512 } };

const UserCard = ({ candidateInfo, likeCandidate, skipCandidate }) => {
    const fullName = candidateInfo.name + " " + candidateInfo.surname[0] + ".";
    const age = "Age: " + moment().diff(candidateInfo.date_of_birth, 'years');;
    const randomHobbies = hobbies.sort(() => 0.5 - Math.random()).slice(0, 10);

    const [profilePictures, setProfilePictures] = useState(null);

    useEffect(() => {
        const fetchPictureURLS = async () => {
            let fetchedProfilePictures = Array(candidateInfo.profile_pictures.length).fill("");
            for (let i = 0; i < candidateInfo.profile_pictures.length; i++) {
                const URL = await getPhotoURL(candidateInfo.profile_pictures[i].url);
                fetchedProfilePictures[i] = { source: { uri: URL } };
            }

            setProfilePictures(fetchedProfilePictures);
        }

        fetchPictureURLS().catch((err) => { console.log(err) });
    }, []);

    const ProfilePictures = () => {
        if (!profilePictures) {
            return (
                <View style={{ height: width, width: width, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={200} />
                </View>
            )
        } else {
            return (
                <View style={{ height: width, width: width }}>
                    <Gallery
                        style={{ flex: 1, backgroundColor: 'white' }}
                        images={profilePictures}
                    />
                </View>
            )
        }
    }

    return (
        <View style={[styles.container, {
            flexDirection: "column"
        }]}>
            <ProfilePictures />
            <Text style={{ fontWeight: "bold", fontSize: 24 }}>{fullName}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{age}</Text>
            <ScrollView style={{ flex: 3, padding: 10 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                    {randomHobbies.map((hobby, index) => {
                        return (
                            <AntDesign key={index} name="smileo" size={28}
                                style={styles.icon}
                                color={'#000'}
                            >
                                <Text style={styles.text}>{hobby}</Text>
                            </AntDesign>
                        )
                    })}
                </View>
            </ScrollView>
            <View style={{ flexDirection: "row", padding: 10 }}>
                <Button style={{ flex: 1 }} icon="heart" onPress={() => likeCandidate(candidateInfo)}>Like</Button>
                <Button style={{ flex: 1 }} icon="close" onPress={() => skipCandidate(candidateInfo)}>Skip</Button>
            </View>
        </View>
    );
}


const MatchingScreen = ({ navigation }) => {

    const [currentCandidate, setCurrentCandidate] = useState(null);
    const store = useStore();
    const likedUsers = useSelector(selectLikedUsers);
    const user = useSelector(selectUser);
    const event = useSelector(selectCurrentEvent);

    const fetchNewCandidate = () => {
        setCurrentCandidate(null);

        const config = {
            params: {
                eventId: event.eventInfo.id,
                userId: user.userId
            }
        }

        axios.get("getBestMatch", config).then((res) => {
            setCurrentCandidate(res.data)
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
            console.log(likedUsers);
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

        console.log(candidate);
        const likeInformation = {
            eventId: event.eventInfo.id,
            likerId: user.userId,
            likedId: candidate.user.pk
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

    if (!currentCandidate) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={200} color="#0000ff" />
            </View>
        )
    }

    return (
        <UserCard candidateInfo={currentCandidate} likeCandidate={likeCandidate} skipCandidate={skipCandidate} />
    );
};

export default MatchingScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1
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
