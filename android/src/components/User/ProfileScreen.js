import React, { useEffect, useState } from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  Alert,
} from 'react-native';
import storage, { firebase } from '@react-native-firebase/storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import { getUserPhotos, uploadPhoto } from '../../services/firebase/UserPhotos';
import { selectUser } from '../../redux/selectors';
import { useSelector } from 'react-redux';
import FirebaseImage from '../Common/FirebaseImage';

const numColumns = 3;
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const userId = 3;

const ProfilePhotos = () => {
  const user = useSelector(selectUser);

  const chooseImage = async (slot) => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true
      });

      try {
        const result = await uploadPhoto(userId, image, slot);
        refreshPhotos();
      } catch (error) {
        //TODO
      }

    } catch (error) {
      //TODO
    }
  };

  const deleteImage = async (slot) => {
    Alert.alert(
      "",
      "Delete",
      [
        {
          text: "Close",
          onPress: () => { }
        },
        {
          text: "Delete",
          onPress: () => console.log("Delete Pressed"),
          style: "cancel"
        }
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        numColumns={numColumns}
        data={user.profile_pictures.concat({ string: null })}
        keyExtractor={(item, index) => "key" + index}
        renderItem={({ item, index }) => {
          if (item.string === null) {
            return (
              <TouchableHighlight key={index} onPress={() => { chooseImage(index + 1) }} onLongPress={() => { deleteImage(index + 1) }}>
                <Image
                  source={require("./assets/addNewPhoto.jpg")}
                  style={{ width: width / numColumns, height: width / numColumns }}
                />
              </TouchableHighlight>
            );
          }

          return (
            <TouchableHighlight key={index} onPress={() => { chooseImage(index + 1) }} onLongPress={() => { deleteImage(index + 1) }}>
              <FirebaseImage
                imageName={item.string}
                style={{ width: width / numColumns, height: width / numColumns }}
              />
            </TouchableHighlight>
          );
        }
        }
      >
      </FlatList >
    </SafeAreaView >
  );
}

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProfilePhotos></ProfilePhotos>
    </SafeAreaView>
  )
};
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
});