
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { useStore } from 'react-redux';
import allActions from '../../redux/actions';
import {Image} from 'react-native';
import axios from 'axios';

const MatchingScreen = ({ navigation }) => {

    const [currentCandidate, setCurrentCandidate] = useState(null);
    const store = useStore();

    const fetchNewCandidate = () => {
        setCurrentCandidate(null);
        axios.get("https://randomuser.me/api/").then((res) => {
            setCurrentCandidate(res.data.results[0]);
            console.log(currentCandidate);
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

    if (!currentCandidate) {
        return (
            <Text>Loading...</Text>
        )
    }

    return (
        <>  
            <Image style={{width: 200, height: 200}} source={{uri:currentCandidate.picture.large}} />
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
    );
};

export default MatchingScreen;
