
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
    Text, View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextInput, Button
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import FirebaseImage from '../Common/FirebaseImage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './ChatScreen';
import moment from 'moment';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const MainMessagesScreen = ({ navigation }) => {

    const [messagedPeople, setMessagedPeople] = useState(null);

    useEffect(() => {
        axios.get('getMessagedPeople/').then((res) => {
            setMessagedPeople(res.data)
        }).catch((err) => {
            console.log(err.response);
        })
    }, [])

    if (!messagedPeople) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={200} color="#0000ff" />
                <Text style={{ textAlign: "center", fontSize: 30, padding: 10 }}> Please wait</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {messagedPeople.map((item, index) => {
                
                const profile = item.profile;
                const event = item.event;
                const eventDate = moment(event.event_finish_time, 'YYYY-MM-DD').fromNow();

                return (
                    <TouchableOpacity
                        key={index}
                        style={{
                            width: width - 34, margin: 5, flexDirection: "row", height: 114, padding: 5,
                            backgroundColor: "DCDCDC", borderColor: "gray", borderWidth: 2, borderRadius: 10
                        }}
                        onPress={() => navigation.navigate('ChatScreen', { profile })}
                    >
                        <FirebaseImage imageName={profile.profile_pictures[0]?.url} style={{ width: 100, height: 100 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ padding: 5, fontSize: 24 }}>{profile.name} {profile.surname}</Text>
                            <Text style={{ padding: 5, fontSize: 16 }}>From event: {event.event_name} | {event.event_location.name}</Text>
                            <Text style={{ paddingHorizontal: 5, fontSize: 16 }}>Matched {eventDate}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    );
};


const MessagesScreen = ({ navigation }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="MainMessagesScreen" component={MainMessagesScreen} options={{ headerShown: false }} />
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
        borderRadius: 10,
    }
});

export default MessagesScreen;
