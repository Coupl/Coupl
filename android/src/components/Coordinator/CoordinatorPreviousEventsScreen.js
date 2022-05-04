import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors';
import FirebaseImage from '../Common/FirebaseImage';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const CoordinatorPreviousEventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    axios.get('/coordinatorPreviousEvents/').then((res) => {
      setEvents(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

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
              <View>
                <Text style={{ fontSize: 18 }}> {match.name + " " + match.surname} </Text>
                <Text style={{ fontSize: 12 }}> Send a message </Text>
              </View>
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
