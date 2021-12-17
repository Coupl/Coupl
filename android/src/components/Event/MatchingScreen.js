
import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';

const MatchingScreen = ({ navigation }) => {

    const [currentCandidate, setCurrentCandidate] = useState(null);

    const fetchNewCandidate = () => {
        setCurrentCandidate(null);

        setTimeout(() => setCurrentCandidate({
            name: "Rüzgar",
            surname: "Ayan",
        }), 1000);
    };

    useEffect(() => {
        fetchNewCandidate();
    },[]);

    if (!currentCandidate) {
        return (
            <Text>Loading...</Text>
        )
    }

    return (
        <>
            <Text>{currentCandidate.name} {currentCandidate.surname}</Text>
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
