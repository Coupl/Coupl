import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AntDesign from "react-native-vector-icons/AntDesign";
import { Dimensions, ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Divider } from 'react-native-paper';
import FirebaseImage from '../Common/FirebaseImage';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const CoordinatorPreviousEventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    axios.get('/coordinatorPreviousEvents/').then((res) => {
      setEvents(res.data);
      setIsDone(true);
    }).catch((err) => {
      console.log(err);
    })
  }, [navigation]);

  return (<>
    {isDone ?
      events.length > 0 ? (
        <ScrollView style={styles.container}>
          {events.map((event, index) => {

            const startTime = moment(event.event_start_time, 'YYYY-MM-DD HH:mm:ss').format('MMMM Do YYYY, h:mm:ss a');

            const start = moment(event.event_start_time, 'YYYY-MM-DD HH:mm:ss');
            const end = moment(event.event_finish_time, 'YYYY-MM-DD HH:mm:ss');
            const duration = moment.duration(end.diff(start)).asHours().toFixed(0);

            return (
              <View key={index + ""} style={{ flex: 1 }}>
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
              </View>
            )
          })}
        </ScrollView>
      ) :
        <View style={styles.container}>
          <Text style={{ textAlign: "center", fontSize: 20, padding: 10 }}> There are no previous events</Text>
        </View> :
      <ScrollView style={styles.container}>
        <ActivityIndicator size={'large'} />
      </ScrollView>
    }
  </>
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

export default CoordinatorPreviousEventsScreen;
