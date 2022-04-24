import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
    Dimensions,
    FlatList, Image,
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from "react-native-vector-icons/AntDesign";
import { data } from "./data";
import UpcomingEventsDetailsScreen from './UpcomingEventsDetailsScreen';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const UpcomingEvents = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({ title: "Upcoming Events" });
    }, []);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={data}
                keyExtractor={item => item.key}
                contentContainerStyle={{ padding: 16 }}
                renderItem={item_ => {
                    const item = item_.item;
                    return (
                        <TouchableOpacity style={{ marginBottom: 16, height: height * 0.40 }} onPress={() => navigation.navigate('UpcomingEventDetails', { item })}>
                            <View style={{ flex: 1, padding: 16 }}>
                                <View
                                    style={
                                        [StyleSheet.absoluteFillObject,
                                        { backgroundColor: '#C0D6E4', borderRadius: 16 },
                                        ]}
                                />
                                <Image style={styles.image} source={{ uri: item.coverImage }} />
                                <Text style={styles.name}>{item.name}</Text>
                                <AntDesign name="enviroment" size={12}
                                    style={styles.icon}
                                    color={'#000'}
                                >

                                    <Text style={styles.description}>{item.location}</Text>
                                </AntDesign>
                                <AntDesign name="calendar" size={12}
                                    style={styles.icon}
                                    color={'#000'}
                                >
                                    <Text style={styles.text}>{item.date}</Text>
                                </AntDesign>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </SafeAreaView>
    );
};

const UpcomingEventsScreen = ({ navigation }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="UpcomingEvents" component={UpcomingEvents} options={{ headerShown: false }} />
            <Stack.Screen name="UpcomingEventDetails" component={UpcomingEventsDetailsScreen}/>
        </Stack.Navigator>
    );
}

export default UpcomingEventsScreen;

const styles = StyleSheet.create({
    name: {
        marginTop: -12,
        fontWeight: '700',
        fontSize: 18,
        color: "black",
    },
    icon: {
        padding: 5,
    },
    description: {
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 14,
        opacity: 0.7
    },
    image: {
        marginLeft: -width * 0.04,
        marginTop: -height * 0.08,
        width: width * 0.92,
        height: height * 0.32,
        position: 'relative',
        top: 0,
        left: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        resizeMode: 'contain',
    }

});
