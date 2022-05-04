import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useStore } from 'react-redux';
import { selectUser } from '../../redux/selectors';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const eventLocationData = [
  { label: 'Bilkent', value: 'Bilkent' },
  { label: 'Bahcelievler', value: 'Bahcelievler' }
]

const eventTagsData = [
  { label: 'Indoor', value: 'Indoor' },
  { label: 'Outdoor', value: 'Outdoor' }
]

const EventCreationNavigation = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({ title: 'Event Creation' });
  });

  const user = useSelector(selectUser);

  const [eventName, setEventName] = useState('');
  const [eventTags, setEventTags] = useState([]);
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventFinishTime, setEventFinishTime] = useState('');

  const [value, setValue] = useState(null);
  const [selected, setSelected] = useState([]);
  const [isSingleFocus, setIsSingleFocus] = useState(false);
  const [isMultiFocus, setIsMultiFocus] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const data = {
    event_name: eventName,
    event_location: eventLocation,
    event_description: eventDescription,
    event_creator: user.userId,
    event_start_time: eventStartTime,
    event_finish_time: eventFinishTime,
    event_tags: eventTags,
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setEventStartTime(date)
    hideDatePicker();
  };

  const onSubmit = () => {
    setLoading(true);

    axios
      .post('addEvent/', data)
      .then(res => {
        const event = res.data;

        if (!event) {
          Toast.show({
            type: 'error',
            text1: 'Event could not be created',
          });
          return;
        }
        Toast.show({
          type: 'success',
          text1: 'Event created',
        });

        setLoading(false);

        navigation.navigate('UpcomingOrganizationsScreen');
      })
      .catch(err => {
        setLoading(false);
        console.log(err.response);
      });
  };

  const renderSubmitButton = () => {
    if (loading) {
      return <ActivityIndicator size={'large'} />;
    }
    return (
      <Button style={styles.submitButton} mode="contained" onPress={onSubmit}>
        Submit
      </Button>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          label="Event Name"
          value={eventName}
          onChangeText={text => setEventName(text)}
        />
        <TextInput
          style={styles.input}
          label="Event Description"
          value={eventDescription}
          multiline={true}
          numberOfLines={4}
          onChangeText={text => setEventDescription(text)}
        />
        <Dropdown
          style={[styles.singleDropdown, isSingleFocus && { borderBottomWidth: 2, borderBottomColor: 'purple' }]}
          placeholderStyle={styles.singlePlaceholderStyle}
          selectedTextStyle={styles.singleSelectedTextStyle}
          data={eventLocationData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isSingleFocus ? 'Event Location' : '...'}
          value={value}
          onFocus={() => setIsSingleFocus(true)}
          onBlur={() => setIsSingleFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsSingleFocus(false);
          }}
        />
        <MultiSelect
          style={[styles.multiDropdown, isMultiFocus && { borderBottomWidth: 2, borderBottomColor: 'purple' }]}
          placeholderStyle={styles.multiPlaceholderStyle}
          selectedTextStyle={styles.multiSelectedTextStyle}
          data={eventTagsData}
          labelField="label"
          valueField="value"
          placeholder="Event Tags"
          value={selected}
          onFocus={() => setIsMultiFocus(true)}
          onChange={item => {
            setSelected(item);
            setIsMultiFocus(false);
          }}
          selectedStyle={styles.multiSelectedStyle}
          inside={true}
        />
        <View style={styles.date}>
          <View style={styles.startDate}>
            <Button style={styles.dateButton} onPress={showDatePicker}>
              <Text style={styles.dateText}>
                {eventStartTime ? eventStartTime.toLocaleDateString() : "Start Time "}
              </Text>
              <AntDesign name="calendar" size={28}
                style={styles.dateIcon}
                color={'purple'}
              />
            </Button>
            <DateTimePickerModal
              mode="datetime"
              isVisible={isDatePickerVisible}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View style={styles.endDate}>
            <Button style={styles.dateButton} onPress={showDatePicker}>
              <Text style={styles.dateText}>
                {eventStartTime ? eventStartTime.toLocaleDateString() : "Start Time "}
              </Text>
              <AntDesign name="calendar" size={28}
                style={styles.dateIcon}
                color={'purple'}

              />
            </Button>
            <DateTimePickerModal
              mode="datetime"
              isVisible={isDatePickerVisible}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </View>
        {renderSubmitButton()}
      </View>
    </ScrollView>
  );
};

export default EventCreationNavigation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    flex: 1,
  },
  submitButton: {
    margin: 10,
    borderRadius: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
    flex: 1,
  },
  singleDropdown: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
    height: 50,
    paddingHorizontal: 14,
  },
  singlePlaceholderStyle: {
    fontSize: 16,
  },
  singleSelectedTextStyle: {
    fontSize: 16,
  },
  multiDropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 10,
    height: 50,
    paddingHorizontal: 14,
  },
  multiPlaceholderStyle: {
    fontSize: 16,
  },
  multiSelectedTextStyle: {
    fontSize: 14,
  },
  multiSelectedStyle: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 3,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    flex: 1,
  },
  dateButton: {
    flex: 1,
  },
  dateText: {
    flex: 1,
    color: 'gray',
  },
  dateIcon: {
    flex: 1,
  },
  startDate: {
    marginLeft: 10,
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  endDate: {
    marginRight: 10,
    marginLeft: 5,
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  }
});
