
import { useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text, TouchableOpacity, View, SafeAreaView
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button } from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { selectUser } from '../../redux/selectors';
import GetLocation from 'react-native-get-location'
import Toast from 'react-native-toast-message';


const QRCodeScannerTimeout = 1000;
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

//https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;
}

const HomeMainScreen = ({ navigation }) => {

    const store = useStore();
    const joinEventAction = allActions.eventActions.joinEvent;

    const joinEvent = (eventId) => {
        const joinEventBody = {
            event_id: eventId
        }

        const getEventBody = {
            event_id: eventId,
        }

        axios.post('joinEvent/', joinEventBody).then((res) => {

            axios.post('getEvent/', getEventBody).then((res) => {
                var eventInfo = res.data;
                store.dispatch(joinEventAction(eventInfo));
                navigation.navigate('EventNavigation');
            }).catch((err) => {
                console.log(err.response);
            });

        }).catch((err) => {
            console.log(err.response);

            //If user is already in the event, let them in
            if (err.response.data === "User is already in event") {
                axios.post('getEvent/', getEventBody).then((res) => {
                    var eventInfo = res.data;
                    store.dispatch(joinEventAction(eventInfo));
                    navigation.navigate('EventNavigation');
                }).catch((err) => {
                    console.log(err.response);
                });
            }

        });

    }

    const onPreviewClick = () => {
        navigation.navigate('QR Code Scanner');
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 5, padding: 10 }}>
                <TouchableOpacity style={styles.qrScannerPreview} onPress={onPreviewClick}>
                    <AntDesign name="camera" size={120}
                        color={'#fff'}
                    >
                    </AntDesign>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'gray' }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DCDCDC", borderColor: 'gray', borderBottomWidth: 3, borderRightWidth: 2, borderBottomLeftRadius: 30, borderBottomEndRadius: 30 }}>
                    <Text style={{ fontSize: 24, color: 'gray', fontWeight: "600" }}>Scan QR Code</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DCDCDC", borderColor: 'gray', borderLeftWidth: 2, borderTopWidth: 3, borderTopRightRadius: 30, borderTopStartRadius: 30 }}>
                    <Text style={{ fontSize: 24, color: 'gray', fontWeight: "600" }}>OR</Text>
                </View>
            </View>

            <View style={{ flex: 5, flexDirection: 'column', padding: 10 }}>

                <TouchableOpacity
                    style={{ flex: 1, marginVertical: 10, backgroundColor: 'rgba(0,128,0,0.1)', justifyContent: "center", alignItems: "center" }}
                    onPress={() => navigation.navigate('UpcomingEventsScreen')}
                >
                    <Text style={{ fontSize: 20, color: 'rgba(0,128,0,1.0)', fontWeight: "600" }}>Check Out the Upcoming Events</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ flex: 1, marginVertical: 10, backgroundColor: 'rgba(0,128,0,0.1)', justifyContent: "center", alignItems: "center" }}
                    onPress={() => navigation.navigate('AttendedEventsScreen')}
                >
                    <Text style={{ fontSize: 20, color: 'rgba(0,128,0,1.0)', fontWeight: "600" }}>See Your Past Events</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const QRCodeScannerScreen = ({ navigation }) => {
    const store = useStore();
    const joinEventAction = allActions.eventActions.joinEvent;

    const joinEvent = (eventId) => {
        const joinEventBody = {
            event_id: eventId
        }

        const getEventBody = {
            event_id: eventId,
        }

        axios.post('getEvent/', getEventBody).then((res) => {
            var eventInfo = res.data;

            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            })
                .then(location => {

                    const lat1 = location.latitude;
                    const lat2 = eventInfo.event_location.latitude;
                    const lon1 = location.longitude;
                    const lon2 = eventInfo.event_location.longitude;

                    const distance = getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2);
                    
                    if (distance > 100) {
                        Toast.show({
                            type: 'error',
                            text1: 'You are not at the event location right now.',
                            text2: 'Still granting access during the test version'
                        });
                    } else {

                        Toast.show({
                            type: 'success',
                            text1: 'Your location is confirmed, joining the event.',
                        });
                    }


                    axios.post('joinEvent/', joinEventBody).then((res) => {

                        store.dispatch(joinEventAction(eventInfo));
                        navigation.navigate('EventNavigation');

                    }).catch((err) => {
                        //If user is already in the event, let them in
                        if (err.response.data === "User is already in event") {
                            store.dispatch(joinEventAction(eventInfo));
                            navigation.navigate('EventNavigation');
                        }

                    });


                })
                .catch(error => {
                    const { code, message } = error;
                    console.warn(code, message);
                })

        }).catch((err) => {
            console.log(err.response);
        });

    }

    const onRead = e => {
        const url = e.data;
        const eventId = url.split("=")[1];
        navigation.navigate("EventHomeScreen");
        joinEvent(eventId);
    }

    const isFocused = useIsFocused();

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, overflow: "hidden" }}>

                {isFocused && <QRCodeScanner
                    onRead={onRead}
                    reactivate={true} //Can be used again
                    reactivateTimeout={QRCodeScannerTimeout}
                />
                }

            </View>
        </View>
    )
}

const HomeScreen = ({ navigation }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="EventHomeScreen" component={HomeMainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="QR Code Scanner" component={QRCodeScannerScreen} />
        </Stack.Navigator>
    )

};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderColor: "gray",
        backgroundColor: "#DCDCDC",
        borderWidth: 2,
        borderRadius: 20,
    },
    text: {
        fontSize: 18,
    },
    qrScannerPreview: {
        backgroundColor: "black",
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
