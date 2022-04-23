import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Dimensions, Text, TouchableOpacity, View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Gallery from 'react-native-image-gallery';
import { ActivityIndicator, RadioButton, TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { selectUser } from '../../redux/selectors';
import { getPhotoURL } from '../../services/firebase/UserPhotos';
import HobbyChooser from './HobbyChooser';
import PhotoChooser from './PhotoChooser';
import ProfilePhotoSwiper from './ProfilePhotoSwiper';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const updateProfileInfo = (user, store) => {
  const setUserAction = allActions.userActions.setUser;

  axios.get("getProfile/").then((res) => {
    const newProfileInfo = {
      ...res.data,
      userId: res.data.user.pk
    };
    store.dispatch(setUserAction(newProfileInfo));
  }).catch((err) => {
    console.log(err);
  })
}

const ProfileDetails = ({ navigation }) => {

  const user = useSelector(selectUser);
  const store = useStore();
  const [userState, setUserState] = useState(user);
  const [haveChanges, setHaveChanges] = useState(false);
  const [profilePictures, setProfilePictures] = useState(null);

  useEffect(() => {
    const fetchPictureURLS = async () => {
      let fetchedProfilePictures = Array(user.profile_pictures.length).fill("");
      for (let i = 0; i < user.profile_pictures.length; i++) {
        const URL = await getPhotoURL(user.profile_pictures[i].url);
        fetchedProfilePictures[i] = { source: { uri: URL } };
      }

      setProfilePictures(fetchedProfilePictures);
    }

    fetchPictureURLS().catch((err) => { console.log(err) });
  }, [user]);

  const saveChanges = () => {
    const postBody = {
      ...userState,
      id: userState.userId
    };
    axios.post('updateProfile/', postBody).then((res) => {
      updateProfileInfo(user, store);
      setHaveChanges(false);
    }).catch((err) => {
      console.log(err);
    });
  }

  const ProfilePictures = useMemo(() => {
    if (!profilePictures) {
      return (
        <View style={{ height: width, width: width, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={200} />
        </View>
      )
    } else {
      return (
        <View style={{ height: width, width: width }}>
          <Gallery
            style={{ flex: 1, backgroundColor: 'white' }}
            images={profilePictures}
          />
        </View>
      )
    }
  }, [profilePictures]);


  const renderMaleRadioButton = (<><Ionicons name="male" size={24} /><Text> Male</Text></>);
  const renderFemaleRadioButton = (<><Ionicons name="female" size={24} /><Text> Female</Text></>);
  const renderBothRadioButton = (<><Ionicons name="male" size={24} /><Ionicons name="female" size={24} /><Text> Both</Text></>);

  const renderSwiperBottom = () => {
    return (
      <View style={{ flexDirection: 'row', marginHorizontal: 24 }}>
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 10, borderRadius: 24, backgroundColor: 'rgba(50, 205, 50, 0.4)' }}
          onPress={() => { navigation.navigate('PhotoChooser') }}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '600', textAlign: 'center' }}>Change Photos</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <ProfilePhotoSwiper profile={user} renderBottom={renderSwiperBottom} />
      <View style={{ flex: 1 }}>
        <TextInput
          label="Description"
          multiline={true}
          value={userState.description}
          onChangeText={text => {
            setUserState({
              ...userState,
              description: text
            });
            setHaveChanges(true);
          }}
        />

        <View>
          <Text>Hobbies</Text>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: 10, borderRadius: 24, backgroundColor: 'rgba(50, 205, 50, 0.4)' }}
            onPress={() => { navigation.navigate('HobbyChooser') }}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600', textAlign: 'center' }}>Edit Hobbies</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text >Match me with:</Text>
          <RadioButton.Group
            onValueChange={value => {
              setUserState({
                ...userState,
                preference: value
              });
              setHaveChanges(true);
            }}
            value={userState.preference}>
            <RadioButton.Item label={renderMaleRadioButton} value={"1"} />
            <RadioButton.Item label={renderFemaleRadioButton} value={"2"} />
            <RadioButton.Item label={renderBothRadioButton} value={"3"} />
          </RadioButton.Group>
        </View>

        {haveChanges &&
          <Button
            title="Save Changes"
            onPress={() => { saveChanges() }}
          />
        }
      </View>
    </ScrollView>
  )
}

const ProfileScreen = ({ navigation }) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} options={{ headerShown: false }} />
      <Stack.Screen name="PhotoChooser" component={PhotoChooser} />
      <Stack.Screen name="HobbyChooser" component={HobbyChooser} />
    </Stack.Navigator>
  )
};

export default ProfileScreen;
