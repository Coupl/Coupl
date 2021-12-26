
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useSelector, useStore } from 'react-redux';
import { selectMatch } from '../../redux/selectors';
import { hobbies } from '../User/data';
import AntDesign from "react-native-vector-icons/AntDesign";
import allActions from '../../redux/actions';
import { MatchStates } from '../../redux/reducers/currentEvent';

const UserCard = ({ match, acceptMatch, removeMatch }) => {
    const candidateInfo = match.user;

    if (!candidateInfo) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ActivityIndicator size={200} color="#0000ff" />
            </View>
        )
    }

    const fullName = candidateInfo.name.first + " " + candidateInfo.name.last[0] + ".";
    const age = "Age: " + candidateInfo.dob.age;

    const randomHobbies = hobbies.sort(() => 0.5 - Math.random()).slice(0, 5);

    const renderMatchChoices = () => {
        if (match.yourAcceptance === MatchStates.WAITING) {
            return (
                <>
                    <Text style={{ fontSize: 15 }}>Meet with your match at: <Text style={{ fontSize: 17, fontWeight: 'bold' }}> {match.location}</Text></Text>
                    <Button onPress={acceptMatch}>Accept</Button>
                    <Button onPress={removeMatch}>Keep Matching</Button>
                </>
            )
        }

        if (match.theirAcceptance === MatchStates.WAITING) {
            return (
                <>
                    <Text>You are waiting for your match's response</Text>
                </>
            )
        }

        if (match.theirAcceptance === MatchStates.REJECTED) {
            return (
                <AntDesign name="smileo" size={15}
                    style={styles.icon}
                    color={'#000'}
                >
                    <Text style={{ fontSize: 15 }}>Your match did not accept, you can keep matching with other people.</Text>
                </AntDesign>
            )
        }

        return (
            <AntDesign name="smileo" size={15}
                style={styles.icon}
                color={'#000'}
            >
                <Text style={{ fontSize: 15 }}>You both accepted, your match is finalized.</Text>
            </AntDesign>
        )
    }

    return (
        <Card>
            <Card.Cover style={{ height: "60%" }} source={{ uri: candidateInfo.picture.large }} />
            <Card.Title title={fullName} subtitle={age} />
            <Card.Content>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                    {randomHobbies.map((hobby, index) => {
                        return (
                            <AntDesign key={index} name="smileo" size={20}
                                style={styles.icon}
                                color={'#000'}
                            >
                                <Text style={styles.text}>{hobby}</Text>
                            </AntDesign>
                        )
                    })}
                </View>
            </Card.Content>
            <View style={{ flex: 1, padding: 20 }}>
                <View style={styles.meetingLocation}>
                    {renderMatchChoices()}
                </View>
            </View>
        </Card>
    );
}

const FoundMatchScreen = ({ navigation }) => {

    const match = useSelector(selectMatch);
    if (!match) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ActivityIndicator size={200} color="#0000ff" />
            </View>
        )
    }

    const store = useStore();

    const removeMatch = () => {
        const removeMatchAction = allActions.eventActions.removeMatch;
        store.dispatch(removeMatchAction());
        navigation.navigate('EventHomeScreen');
    }

    const acceptMatch = () => {
        const acceptMatchAction = allActions.eventActions.acceptMatch;
        store.dispatch(acceptMatchAction());

        const matchsChoice = setInterval(() => {
            console.log("here");
            if (Math.random() < 0.5) {

                const matchsChoiceAction = allActions.eventActions.matchsChoice;
                store.dispatch(matchsChoiceAction(Math.random() < 0.5));
                clearInterval(matchsChoice);
            }
        }, 1000)
    }

    return (
        <View style={styles.container}>
            <UserCard match={match} removeMatch={removeMatch} acceptMatch={acceptMatch} />
        </View>
    );
};

export default FoundMatchScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    meetingLocation: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgreen',
    },
    icon: {
        padding: 10,
    },
    text: {
        fontSize: 14,
    },
});