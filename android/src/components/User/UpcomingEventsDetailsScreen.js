import React, { useEffect } from 'react';
import {
  Dimensions, Image, ScrollView, StyleSheet, Text, View
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const UpcomingEventsDetailsScreen = ({ navigation, route }) => {
  const { item } = route.params;
  useEffect(() => {
    navigation.setOptions({ title: `${item.name}` });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Image style={styles.image} source={{ uri: item.eventImage }} />
      <View style={styles.background}>
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
            <AntDesign name="enviroment" size={28}
              style={styles.icon}
              color={'#000'}
            >
              <Text style={styles.text}>{item.location}</Text>
            </AntDesign>
            <AntDesign name="calendar" size={28}
              style={styles.icon}
              color={'#000'}
            >
              <Text style={styles.text}>{item.date}</Text>
            </AntDesign>
            <AntDesign name="clockcircle" size={28}
              style={styles.icon}
              color={'#000'}
            >
              <Text style={styles.text}>{item.startTime + " - " + item.endTime}</Text>
            </AntDesign>
            {item.tags.map((tag, index) => {
              return (
                <AntDesign key={index} name="slack-square" size={28}
                  style={styles.icon}
                  color={'#000'}
                >
                  <Text style={styles.text}>{tag}</Text>
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
