
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { Animated, Image, StyleSheet, View } from 'react-native';
import axios from 'axios';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import AntDesign from "react-native-vector-icons/AntDesign";
import { selectLikedUsers } from '../../redux/selectors';
import { hobbies, meetingLocations } from '../User/data';

const UserCard = ({ candidateInfo, likeCandidate, skipCandidate }) => {
    const fullName = candidateInfo.name.first + " " + candidateInfo.name.last[0] + ".";
    const age = "Age: " + candidateInfo.dob.age;

    const randomHobbies = hobbies.sort(() => 0.5 - Math.random()).slice(0, 4);

    //Temporary solution to render random photo.
    candidateInfo.picture.large = "https://i.pravatar.cc/" + parseInt(Math.random()*100 + 500);

    return (
        <Card>
            <Card.Cover style={{ height: "60%" }} source={{ uri: candidateInfo.picture.large }} />
            <Card.Title title={fullName} subtitle={age} />
            <Card.Content>
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
            </Card.Content>
            <Card.Actions>
                <Button icon="heart" onPress={() => likeCandidate(candidateInfo)}>Like</Button>
                <Button icon="close" onPress={() => skipCandidate(candidateInfo)}>Skip</Button>
            </Card.Actions>
        </Card>
    );

    /*
    <>
    <Image style={{ width: 200, height: 200 }} source={{ uri: currentCandidate.picture.large }} />
            <Text>{currentCandidate.name.first} {currentCandidate.name.last}</Text>
            <Button
                mode="contained"
                onPress={() => fetchNewCandidate()}
            >
                Like
            </Button>
            <Button
                mode="contained"
                onPress={() => fetchNewCandidate()}
            >
                Skip
            </Button>   
    </>
    */
}


const MatchingScreen = ({ navigation }) => {

    const [currentCandidate, setCurrentCandidate] = useState(null);
    const store = useStore();
    const likedUsers = useSelector(selectLikedUsers);

    const fetchNewCandidate = () => {
        setCurrentCandidate(null);
        axios.get("https://randomuser.me/api/").then((res) => {
            setTimeout(() => { setCurrentCandidate(res.data.results[0]) }, 500);
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
        const foundMatch = (Math.random() < 0.4);
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
        store.dispatch(likeUserAction(candidate));
        checkMatch();
        fetchNewCandidate();
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
