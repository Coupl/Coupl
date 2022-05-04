import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors';
import FirebaseImage from '../Common/FirebaseImage';
import ChatScreen from './ChatScreen';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const MainAttendedEventsScreen = ({ navigation }) => {
    const [events, setEvents] = useState(null);
    const user = useSelector(selectUser);

    useEffect(() => {
        axios.get('listAttendedEvents/').then((res) => {
            setEvents(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    if (!events) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={200} color="#0000ff" />
                <Text style={{ textAlign: "center", fontSize: 30, padding: 10 }}> Please wait</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {events.map((item, index) => {
                const event = item.event;
                const match = item.profile;
                const MatchBox = () => {
                    if (!match) {
                        return (
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <Text > No match </Text>
                            </View>
                        );
                    }


                    return (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <TouchableOpacity onPress={()=> {
                                navigation.navigate('ChatScreen', { profile: match })
                            }}>
                                <Text style={{ fontSize: 18 }}> {match.name + " " + match.surname} </Text>
                                <Text style={{ fontSize: 12 }}> Send a message </Text>
                            </TouchableOpacity>
                            <View style={{ flexBasis: 50 }}>
                                <FirebaseImage imageName={match?.profile_pictures[0]?.url} style={{ width: 50, height: 50 }}></FirebaseImage>
                            </View>
                        </View>

                    );
                }

                const date = moment(event.event_start_time, 'YYYY-MM-DD').format('MMMM Do YYYY');

                return (
                    <View key={index + ""} style={{ flex: 1 }}>
                        <View style={{ flex: 1, padding: 5, margin: 5, }} >
                            <View style={{ overflow: "hidden" }}>
                                <FirebaseImage imageName={event.event_location.location_picture[0]?.url} style={{ width: width, height: width / 3 }}></FirebaseImage>
                            </View>
                            <View style={{ paddingVertical: 10, flex: 1, flexDirection: 'row' }}>

                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}> {event.event_name} </Text>
                                    <Text style={{ fontSize: 12 }}> {date} </Text>
                                </View>
                                <View style={{ flex: 1, position: "absolute", right: 0, top: 10 }}>
                                    <MatchBox />
                                </View>
                            </View>
                        </View>

                        <Divider style={{}} />
                    </View>
                )
            })}
        </ScrollView>
    );
}

const AttendedEventsScreen = ({ navigation }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="MainAttendedEventsScreen" component={MainAttendedEventsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderColor: "gray",
        backgroundColor: "#DCDCDC",
        borderWidth: 2,
        borderRadius: 20,
    },
});

export default AttendedEventsScreen;
