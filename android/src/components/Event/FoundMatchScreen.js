
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button } from 'react-native-paper';
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { MatchStates } from '../../redux/reducers/currentEvent';
import { selectActiveMatchDecision, selectActiveMatchDetails, selectActiveMatchProfile, selectCurrentEvent, selectUser } from '../../redux/selectors';
import FirebaseImage from '../Common/FirebaseImage';
import ProfilePhotoSwiper from '../User/ProfilePhotoSwiper';
import axios from 'axios';

const FoundMatchScreen = ({ navigation }) => {

    const user = useSelector(selectUser);
    const match = useSelector(selectActiveMatchProfile);
    const matchDetails = useSelector(selectActiveMatchDetails);
    const decision = useSelector(selectActiveMatchDecision);
    const currentEvent = useSelector(selectCurrentEvent);
    const store = useStore();

    const setActiveMatch = allActions.eventActions.setActiveMatch;

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

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

    const checkMatch = () => {
        const postBody = {
            event_id: currentEvent.eventInfo.id
        }
        axios.post('getActiveLikes/', postBody).then((res) => {
            store.dispatch(setActiveMatch(res.data));
        }).catch((err) => {
            console.log(err);
        })
    }

    const acceptMatch = () => {
        const acceptMatchAction = allActions.eventActions.acceptActiveMatch;
        store.dispatch(acceptMatchAction());

        const confirmInformation = {
            event_id: currentEvent.eventInfo.id
        }

        axios.post("confirmMatch/", confirmInformation).then((res) => {
            checkMatch();
        }).catch((err) => {
            console.log(err);
        })
    }

    const rejectMatch = () => {
        const skipInformation = {
            event_id: currentEvent.eventInfo.id,
            skipped_id: match.user.pk
        }

        axios.post("skipUser/", skipInformation).then((res) => {
            navigation.navigate("EventHomeScreen");
        }).catch((err) => {
            console.log(err);
        })
    }
    
    const setMeetingLocation = () => {
        const locationInformation = {
            event_id: currentEvent.eventInfo.id,
            liked_id: match.user.pk,
            sub_area_id: value
        };

        axios.post("setMeetingLocation/", locationInformation).then((res) => {
            checkMatch();
        }).catch((err) => {
            console.log(err);
        })
    } 

    const BottomPanel = () => {
        const locationChoser = (user.userId < match.user.pk);

        const dropDownItems = currentEvent.eventInfo.sub_areas.map((subarea) => {
            return {
                label: subarea.area_name,
                img: subarea.area_picture,
                description: subarea.area_description,
                value: subarea.pk
            }
        })

        if (matchDetails.state === MatchStates.ACTIVE_MATCH && locationChoser) {
            return (
                <>
                    <Text style={{ fontSize: 20 }}>You have both liked each other</Text>
                    <Text style={{ fontSize: 16 }}>Choose a location to meet:</Text>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={dropDownItems}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={() => { }}
                        listMode="MODAL"
                        style={{ marginVertical: 10 }}
                        renderListItem={(props) => {

                            return (
                                <TouchableOpacity onPress={() => {
                                    setValue(props.item.value);
                                    setOpen(false);
                                }}>
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row", borderColor: "gray", backgroundColor: "#DCDCDC", borderWidth: 2, borderRadius: 10, margin: 5 }}>
                                        <View style={{ padding: 5, flexBasis: 100, borderRadius: 10, overflow: "hidden" }}>
                                            <FirebaseImage imageName={props.item.img} style={{ width: 100, height: 100 }}></FirebaseImage>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ padding: 10, fontSize: 24 }}>{props.item.label}</Text>
                                            <Text style={{ padding: 10, fontSize: 20 }}>{props.item.description}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />

                    <Button
                        style={{}}
                        mode="contained"
                        onPress={() => {setMeetingLocation()}}
                    >
                        Confirm
                    </Button>
                </>
            )
        }

        if (matchDetails.state === MatchStates.ACTIVE_MATCH && !locationChoser) {
            return (
                <>
                    <Text style={{ fontSize: 20 }}>You have both liked each other</Text>
                    <ActivityIndicator style={{ margin: 10 }} />
                    <Text style={{ fontSize: 16 }}>Waiting for {match.name} to choose a meeting location.</Text>
                </>
            )
        }

        if (matchDetails.state === MatchStates.FIRST_CONFIRMATION && decision) {

            return (
                <>
                    <Text style={{ fontSize: 20 }}>You are waiting for {match.name}'s response.</Text>
                    <ActivityIndicator style={{ margin: 10 }} />
                </>
            )
        }

        if (matchDetails.state === MatchStates.FIRST_CONFIRMATION && !decision || matchDetails.state === MatchStates.LOCATION_CHOSEN) {

            const meetingLocation = currentEvent.eventInfo.sub_areas.filter((subarea) => subarea.pk === matchDetails.meeting_location)[0];

            return (
                <>
                    <Text style={{ fontSize: 20 }}>You have both liked each other</Text>
                    <Text style={{ fontSize: 16 }}>Meet with {match.name} at:</Text>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row", borderColor: "gray", backgroundColor: "#DCDCDC", borderWidth: 2, borderRadius: 10, margin: 5 }}>
                        <View style={{ padding: 5, flexBasis: 100, borderRadius: 10, overflow: "hidden" }}>
                            <FirebaseImage imageName={meetingLocation.area_picture} style={{ width: 100, height: 100 }}></FirebaseImage>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ padding: 10, fontSize: 24 }}>{meetingLocation.area_name}</Text>
                            <Text style={{ padding: 10, fontSize: 20 }}>{meetingLocation.area_description}</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", padding: 10 }}>
                        <Button icon="heart" onPress={() => {acceptMatch()}}>Accept</Button>
                        <Button icon="close" onPress={() => {rejectMatch()}}>Find another match</Button>
                    </View>
                </>
            )
        }

        if (matchDetails.state === MatchStates.SUCCESSFUL_MATCH) {

            return (
                <>
                    <Text style={{ fontSize: 20 }}>You are successfully matched with {match.name}.</Text>
                    
                </>
            )
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{ overflow: "hidden", borderRadius: 50 }}>
                <ProfilePhotoSwiper profile={match} renderBottom={null} />
            </View>
            <View style={styles.innerContainer}>
                <BottomPanel />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        margin: 10,
        borderColor: "gray",
        backgroundColor: "#DCDCDC",
        borderWidth: 2,
        borderRadius: 50
    },
    innerContainer: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderColor: "gray",
        backgroundColor: "#DCDCDC",
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 10
    }
});

export default FoundMatchScreen;
