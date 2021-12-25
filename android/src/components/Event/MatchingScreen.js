
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { Animated, Image, StyleSheet, View } from 'react-native';
import axios from 'axios';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import AntDesign from "react-native-vector-icons/AntDesign";

const hobbies = ["Amateur radio", "Acting", "Baton twirling", "Board games", "Book restoration", "Cabaret", "Calligraphy", "Candle making", "Computer programming", "Coffee roasting", "Cooking", "Coloring", "Cosplaying", "Couponing", "Creative writing", "Crocheting", "Cryptography", "Dance", "Digital arts", "Drama", "Drawing", "Do it yourself", "Electronics", "Embroidery", "Fashion", "Flower arranging", "Foreign language learning", "Gaming", "tabletop games", "role-playing games", "Gambling", "Genealogy", "Glassblowing", "Gunsmithing", "Homebrewing", "Ice skating", "Jewelry making", "Jigsaw puzzles", "Juggling", "Knapping", "Knitting", "Kabaddi", "Knife making", "Lacemaking", "Lapidary", "Leather crafting", "Lego building", "Lockpicking", "Machining", "Macrame", "Metalworking", "Magic", "Model building", "Listening to music", "Origami", "Painting", "Playing musical instruments", "Pet", "Poi", "Pottery", "Puzzles", "Quilting", "Reading", "Scrapbooking", "Sculpting", "Sewing", "Singing", "Sketching", "Soapmaking", "Sports", "Stand-up comedy", "Sudoku", "Table tennis", "Taxidermy", "Video gaming", "Watching movies", "Web surfing", "Whittling", "Wood carving", "Woodworking", "Worldbuilding", "Writing", "Yoga", "Yo-yoing", "Air sports", "Archery", "Astronomy", "Backpacking", "BASE jumping", "Baseball", "Basketball", "Beekeeping", "Bird watching", "Blacksmithing", "Board sports", "Bodybuilding", "Brazilian jiu-jitsu", "Community", "Cycling", "Dowsing", "Driving", "Fishing", "Flag Football", "Flying", "Flying disc", "Foraging", "Gardening", "Geocaching", "Ghost hunting", "Graffiti", "Handball", "Hiking", "Hooping", "Horseback riding", "Hunting", "Inline skating", "Jogging", "Kayaking", "Kite flying", "Kitesurfing", "LARPing", "Letterboxing", "Metal detecting", "Motor sports", "Mountain biking", "Mountaineering", "Mushroom hunting", "Mycology", "Netball", "Nordic skating", "Orienteering", "Paintball", "Parkour", "Photography", "Polo", "Rafting", "Rappelling", "Rock climbing", "Roller skating", "Rugby", "Running", "Sailing", "Sand art", "Scouting", "Scuba diving", "Sculling", "Rowing", "Shooting", "Shopping", "Skateboarding", "Skiing", "Skimboarding", "Skydiving", "Slacklining", "Snowboarding", "Stone skipping", "Surfing", "Swimming", "Taekwondo", "Tai chi", "Urban exploration", "Vacation", "Vehicle restoration", "Water sports",];

const UserCard = ({ candidateInfo, likeCandidate, skipCandidate }) => {
    const fullName = candidateInfo.name.first + " " + candidateInfo.name.last[0] + ".";
    const age = "Age: " + candidateInfo.dob.age;

    const randomHobbies = hobbies.sort(() => 0.5 - Math.random()).slice(0, 5);
    
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
                <Button icon="heart" onPress={() => likeCandidate()}>Like</Button>
                <Button icon="close" onPress={() => skipCandidate()}>Skip</Button>
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

    const fetchNewCandidate = () => {
        setCurrentCandidate(null);
        axios.get("https://randomuser.me/api/").then((res) => {
            setTimeout(() => { setCurrentCandidate(res.data.results[0]) }, 500);
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

    const likeCandidate = (candidate) => {
        fetchNewCandidate();
    }
    const skipCandidate = (candidate) => {
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
