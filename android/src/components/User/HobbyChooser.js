import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector, useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { selectUser } from '../../redux/selectors';

const UNSELECTED_COLOR = 'rgba(130, 130, 130, 0.4)';
const SELECTED_COLOR = 'rgba(50, 205, 50, 0.4)';
const REMOVED_COLOR = 'rgba(240, 128, 128, 0.4)';

const COLORS = [UNSELECTED_COLOR, SELECTED_COLOR, SELECTED_COLOR, REMOVED_COLOR];

const NONE = 0;
const SELECTED = 1;
const JUST_SELECTED = 2;
const JUST_REMOVED = 3;

const HobbyChooser = () => {
  const user = useSelector(selectUser);
  const store = useStore();
  const changeHobbiesAction = allActions.userActions.changeHobbies;
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    axios.get('getHobbies/').then((res) => {
      const hobbiesMapped = res.data.map((hobby) => {
        const state = user.hobbies.filter(userHobby => (hobby.title === userHobby.title)).length > 0 ? SELECTED : NONE;
        return {
          ...hobby,
          loading: false,
          state: state,
        }
      });
      setHobbies(hobbiesMapped);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const hobbyTypesArray = hobbies.map((hobby) => hobby.type);
  const hobbyTypes = [...new Set(hobbyTypesArray)];

  const categorizedHobbies = hobbyTypes.map((hobbyType) => {
    return {
      type: hobbyType,
      list: hobbies.filter((hobby) => hobby.type === hobbyType)
    }
  });
  
  const handlePress = (hobby) => {
    const numSelected = hobbies.filter(userHobby => (userHobby.state === SELECTED || userHobby.state === JUST_SELECTED)).length;
    const alreadySelected = (hobby.state === SELECTED) || (hobby.state === JUST_SELECTED);
    if (!alreadySelected && numSelected >= 10) return;

    const index = hobbies.map((hobby) => hobby.title).indexOf(hobby.title);

    let loadingHobbies = [...hobbies];
    loadingHobbies[index].loading = true;
    setHobbies(loadingHobbies);

    const requestURL = alreadySelected ? 'removeProfileHobby/' : 'addProfileHobby/';

    const postBody = {
      title: hobby.title
    };
    axios.post(requestURL, postBody).then((res) => {
      let newHobbies = [...hobbies];
      newHobbies[index].state = alreadySelected ? JUST_REMOVED : JUST_SELECTED;
      newHobbies[index].loading = false;
      setHobbies(newHobbies);

      const newSelectedHobbies = newHobbies.filter(hobby => (hobby.state === SELECTED || hobby.state === JUST_SELECTED))
        .map((hobby) => { return { title: hobby.title, type: hobby.type } });

      store.dispatch(changeHobbiesAction(newSelectedHobbies));
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <ScrollView>

      {
        hobbies.filter(userHobby => (userHobby.state === SELECTED || userHobby.state === JUST_SELECTED)).length < 10 ?
          <Text style={{ alignSelf: "center", fontSize: 26 }}>Select up to 10 hobbies:</Text> :
          <Text style={{ alignSelf: "center", fontSize: 26 }}>You have selected the maximum of 10 hobbies.</Text>
      }

      <View style={{ flex: 1 }}>
        {categorizedHobbies.map((hobbyCategory, index) => {
          return (
            <View key={index} style={{ flex: 1 }}>

              <Text style={{alignSelf: "center", fontSize: 22}}>{hobbyCategory.type}</Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', padding: 10, borderRadius: 10, borderWidth: 2, margin: 10 }}
              >
                {hobbyCategory.list.map((hobby, index) => {
                  const color = COLORS[hobby.state];
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{ flexDirection: "row", paddingVertical: 10, paddingHorizontal: 5, borderRadius: 24, margin: 5, backgroundColor: color }}
                      onPress={() => { handlePress(hobby); }}
                    >
                      <Text >{hobby.title}</Text>
                      {
                        hobby.loading &&
                        <ActivityIndicator />
                      }
                      {
                        (hobby.state === JUST_SELECTED) &&
                        <AntDesign key={index} name="check" style={{ marginHorizontal: 5 }} size={16} />
                      }
                      {
                        (hobby.state === JUST_REMOVED) &&
                        <AntDesign key={index} name="close" style={{ marginHorizontal: 5 }} size={16} />
                      }
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )
        })
        }
      </View>

    </ScrollView >
  );
}

export default HobbyChooser;
