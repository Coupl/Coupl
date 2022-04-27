import React, { useEffect } from 'react';
import {
  Dimensions, Image, ScrollView, StyleSheet, Text, View
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from 'moment';
import FirebaseImage from '../Common/FirebaseImage';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const UpcomingEventsDetailsScreen = ({ navigation, route }) => {
  const { item } = route.params;

  const startTime = moment(item.event_start_time, 'YYYY-MM-DD').format('MMMM Do YYYY, h:mm:ss a');
  const finishTime = moment(item.event_finish_time, 'YYYY-MM-DD').format('MMMM Do YYYY, h:mm:ss a');
  const imageName = item.event_location.location_picture[0]?.url;
  //TODO: show all the photos with EventPhotoSwiper here 

  useEffect(() => {
    navigation.setOptions({ title: `${item.event_name}` });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <FirebaseImage style={styles.image} imageName={imageName} />
      <View style={styles.background}>
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
            <AntDesign name="enviroment" size={28}
              style={styles.icon}
              color={'#000'}
            >
              <Text style={styles.text}>{item.event_location.name}</Text>
            </AntDesign>
            <AntDesign name="clockcircle" size={28}
              style={styles.icon}
              color={'#000'}
            >
              <Text style={styles.text}>{startTime + " - " + finishTime}</Text>
            </AntDesign>
            {item.event_tags.map((tag, index) => {
              return (
                <AntDesign key={index} name="slack-square" size={28}
                  style={styles.icon}
                  color={'#000'}
                >
                  <Text style={styles.text}>{tag.tag_name}</Text>
                </AntDesign>
              )
            })}
          </View>
          <Text style={styles.description}>{item.description}</Text>
        </ScrollView>
      </View>
    </View>
  )
}



export default UpcomingEventsDetailsScreen;


const styles = StyleSheet.create({
  description: {
    paddingTop: 10,
    padding: 10,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'justify',
  },
  icon: {
    padding: 10,
  },
  text: {
    fontSize: 18,
  },
  image: {
    marginTop: -height * 0.03,
    width: width,
    height: height * 0.4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'contain',
  },
  background: {
    paddingTop: 20,
    position: 'absolute',
    width,
    height,
    transform: [{ translateY: height * 0.3 }],
    backgroundColor: '#fff',
    borderRadius: 32
  }
});
