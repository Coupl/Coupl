import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList, StyleSheet, Text, TouchableOpacity, View, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from "react-native-vector-icons/AntDesign";
import FirebaseImage from '../Common/FirebaseImage';
import CoordinatorUpcomingEventDetailsScreen from './CoordinatorUpcomingEventDetailsScreen';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const UpcomingEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: "Upcoming Events" });
    //Change the end point
    axios.get('listEvents/').then((res) => {
      setEvents(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={item_ => {
          const item = item_.item;
          const imageName = item.event_location.location_picture[0]?.url;
          const startTime = moment(item.event_start_time, 'YYYY-MM-DD').format('MMMM Do YYYY, h:mm:ss a');
          return (
            <TouchableOpacity style={{ marginBottom: 16, height: height * 0.40 }} onPress={() => navigation.navigate('UpcomingEventDetails', { item })}>
              <View style={{ flex: 1, padding: 16 }}>
                <View
                  style={
                    [StyleSheet.absoluteFillObject,
                    { backgroundColor: '#C0D6E4', borderRadius: 16 },
                    ]}
                />
                <FirebaseImage style={styles.image} imageName={imageName} />
                <Text style={styles.name}>{item.event_name}</Text>
                <AntDesign name="enviroment" size={12}
                  style={styles.icon}
                  color={'#000'}
                >

                  <Text style={styles.description}>{item.event_location.name}</Text>
                </AntDesign>
                <AntDesign name="calendar" size={12}
                  style={styles.icon}
                  color={'#000'}
                >
                  <Text style={styles.text}>{startTime}</Text>
                </AntDesign>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <View>
        <TouchableOpacity onPress={() => { navigation.navigate('EventCreationNavigation'); }}>
          <Image style={styles.eventCreation} source={require("./assets/plus.png")} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const CoordinatorUpcomingEventsScreen = ({ navigation }) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="UpcomingEvents" component={UpcomingEvents} options={{ headerShown: false }} />
      <Stack.Screen name="CoordinatorUpcomingEventDetails" component={CoordinatorUpcomingEventDetailsScreen} />
    </Stack.Navigator>
  );
}

export default CoordinatorUpcomingEventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    borderColor: "gray",
    backgroundColor: "#DCDCDC",
    borderWidth: 2,
    borderRadius: 20,
  },
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
    width: width * 0.92 - 24,
    height: height * 0.32,
    position: 'relative',
    top: 0,
    left: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'contain',
  },
  eventCreation: {
    position: 'absolute',
    right: 5,
    bottom: 10,
    resizeMode: 'contain',
    width: 70,
    height: 70
  }

});
