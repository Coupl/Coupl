import React from 'react';
import {
    Text,
    Image,
    View,
    StyleSheet,
    FlatList,
    SafeAreaView, 
    StatusBar,
} from 'react-native';
import { data } from "./profile_photo_data";


const profile = {
    image: "https://source.unsplash.com/user/c_v_r",
    name: "Emre",
    surname : "Derman",
    phone : "05376080368",
    birthdate : "06.03.1999",
    gender : "Male",
    preferredGender : "Female",
  }

const ProfileScreen = ({ navigation }) => {
  
    const renderImage = ({ item }) => {
       return (
        <Image
            style={styles.uploadedImage}
            source={{uri: item}}
      />
    );
  };

       return (
        <View style={styles.headerContainer}>
                 <View style={styles.headerColumn}>
                    <Image
                      style={styles.userImage}
                      source={{uri: profile.image}}
                    />
                    <Text style={styles.userText_1}>{profile.name} {profile.surname}</Text>
                    <Text style={styles.userText_2}>Gender : {profile.gender}</Text>
                    <Text style={styles.userText_1}>Looking for : {profile.preferredGender}</Text>
                    <Text style={styles.userText_2}>Phone : {profile.phone}</Text>
                    <Text style={styles.userText_1}>Birthdate : {profile.birthdate}</Text>
                    <Text style={styles.userText_2}>Uploaded photos </Text>
                </View>
            <FlatList
                data={data}
                keyExtractor={item => item.key}
                contentContainerStyle={{ padding: 16 }}
                renderItem={item_ => {
                    const item = item_.item;
                    return (
                        <Image style={styles.uploadedImage} source={{ uri: item.image_url}}/>
                        
                    );
                }}
            />
        </View>
    );
};    
export default ProfileScreen;  


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
 
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },

  uploadedImage: {
    borderColor: '#FFF',
    height: 200,
    width: 200,
  },


  userText_1: {
    color: '#F39C12 ',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  userText_2: {
    color: '#1C2833 ',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
})
