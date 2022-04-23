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
import { TextInput } from 'react-native-paper';
import storage, { firebase } from '@react-native-firebase/storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import { getUserPhotos, uploadPhoto } from '../../services/firebase/UserPhotos';
import { selectUser } from '../../redux/selectors';
import { useSelector, useStore } from 'react-redux';
import FirebaseImage from '../Common/FirebaseImage';
import axios from 'axios';
import allActions from '../../redux/actions';

const numColumns = 2;
const numRows = 3;
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const updateProfileInfo = (user, store) => {
  const setUserAction = allActions.userActions.setUser;

  axios.get("getProfile/").then((res) => {
    const newProfileInfo = res.data;
    store.dispatch(setUserAction(newProfileInfo));
  }).catch((err) => {
    console.log(err);
  })
}

const PhotoChooser = () => {
  const user = useSelector(selectUser);
  const store = useStore();

  const chooseImage = async (slot) => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true
      });

      const result = await uploadPhoto(user.userId, image, slot);
      if (!result) return;

      const postBody = {
        title: "empty",
        description: "empty",
        url: result,
        order: -1
      }

      axios.post("addPicture/", postBody).then((res) => {
        updateProfileInfo(user, store);
      }).catch((err) => {
        console.log(err);
      })


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
          onPress: () => {

            const postBody = {
              order: slot
            }

            axios.post("removePicture/", postBody).then((res) => {
              updateProfileInfo(user, store);
            }).catch((err) => {
              console.log(err);
            })

          },
          style: "cancel"
        }
      ]
    );
  }

  const pictureSlots = (user.profile_pictures.length >= numRows * numColumns) ? user.profile_pictures : user.profile_pictures.concat({ string: null });

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        numColumns={numColumns}
        data={pictureSlots}
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
                imageName={item.url}
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

export default PhotoChooser;
