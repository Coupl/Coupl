import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions, Image, ScrollView, StyleSheet, Text, View, PermissionsAndroid, Platform
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from 'moment';
import FirebaseImage from '../Common/FirebaseImage';
import QRCode from 'react-native-qrcode-svg';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

//TODO: add edit button for coordinator to edit the events
const CoordinatorUpcomingEventDetailsScreen = ({ navigation, route }) => {
  const { item } = route.params;

  const startTime = moment(item.event_start_time, 'YYYY-MM-DD HH:mm:ss').format('MMMM Do YYYY, h:mm:ss a');
  const finishTime = moment(item.event_finish_time, 'YYYY-MM-DD HH:mm:ss').format('MMMM Do YYYY, h:mm:ss a');
  const imageName = item.event_location.location_picture[0]?.url;
  //TODO: show all the photos with EventPhotoSwiper here 

  useEffect(() => {
    navigation.setOptions({ title: `${item.event_name}` });
  }, []);

  const qrCodeValue = "coupl.github.io/joinEvent?eventId=" + item.id;

  return (
    <View style={styles.container}>
      <View style={{borderRadius: 20, overflow: "hidden"}}>
        <FirebaseImage style={{ width: width, height: width / 2 }} imageName={imageName} />
      </View>
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


        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ marginBottom: 10, fontSize: 22 }}>QR Code to enter the event</Text>
          <QRCode
            style={{ marginVertical: 20 }}
            size={width - 100}
            logoBackgroundColor='#DCDCDC'
            logo={require('./assets/logo.png')}
            value={qrCodeValue}
          />
        </View>
      </ScrollView>
    </View>
  )
}



export default CoordinatorUpcomingEventDetailsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    borderColor: "gray",
    backgroundColor: "#DCDCDC",
    borderWidth: 2,
    borderRadius: 20,
  },
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
    width: width - 24,
    height: height * 0.4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'contain',
  },
  background: {
    width: width - 24,
    height,
    backgroundColor: '#fff',
    borderRadius: 32
  }
});
