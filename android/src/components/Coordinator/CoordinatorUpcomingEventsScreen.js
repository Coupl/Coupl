import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, ActivityIndicator
} from 'react-native';
import { Divider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import AntDesign from "react-native-vector-icons/AntDesign";
import FirebaseImage from '../Common/FirebaseImage';
import CoordinatorUpcomingEventDetailsScreen from './CoordinatorUpcomingEventDetailsScreen';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const UpcomingEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: "Upcoming Events" });
    //Change the end point
    axios.get('/coordinatorUpcomingEvents/').then((res) => {
      setEvents(res.data);
      setIsDone(true);
    }).catch((err) => {
      console.log(err);
    })
  }, [navigation]);


  return (<>
    {isDone ? (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {events.map((event, index) => {

            const startTime = moment(event.event_start_time, 'YYYY-MM-DD HH:mm:ss').format('MMMM Do YYYY, h:mm:ss a');
            const start = moment(event.event_start_time, 'YYYY-MM-DD HH:mm:ss');
            const end = moment(event.event_finish_time, 'YYYY-MM-DD HH:mm:ss');
            const duration = moment.duration(end.diff(start)).asHours().toFixed(0);

            return (
              <TouchableOpacity key={index + ""} style={{ flex: 1 }} onPress={() => navigation.navigate('CoordinatorUpcomingEventDetails', { item: event })}>
                <View style={{ flex: 1, padding: 5, margin: 5, }} >
                  <View style={{ overflow: "hidden" }}>
                    <FirebaseImage imageName={event.event_location.location_picture[0]?.url} style={{ width: width, height: width / 3 }}></FirebaseImage>
                  </View>
                  <View style={{ paddingVertical: 10, flex: 1, flexDirection: 'row' }}>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18 }}> {event.event_name} </Text>
                      <AntDesign name="enviroment" size={12}
                        style={styles.icon}
                        color={'#000'}
                      >

                        <Text style={styles.description}>{event.event_location.name}</Text>
                      </AntDesign>
                      <AntDesign name="calendar" size={12}
                        style={styles.icon}
                        color={'#000'}
                      >
                        <Text style={styles.text}>{startTime}</Text>
                      </AntDesign>
                    </View>



                    <View style={{ flex: 1, position: "absolute", right: 0, top: 10 }}>
                      <Text style={{ fontSize: 18 }}> Event length: {duration} hours </Text>
                    </View>
                  </View>
                </View>

                <Divider style={{}} />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <TouchableOpacity onPress={() => { navigation.navigate('EventCreationNavigation'); }}>
          <Image style={styles.eventCreation} source={require("./assets/plus.png")} />
        </TouchableOpacity>
      </View>
    ) :
      <ScrollView style={styles.container}>
        <ActivityIndicator size={'large'} />
      </ScrollView>
    }
  </>
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
    marginTop: 12,
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