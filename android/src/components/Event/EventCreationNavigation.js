import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const EventCreationNavigation = ({ navigation }) => {

  useEffect(() => {
    navigation.setOptions({ title: 'Event Creation' });

    axios.get('/listTags').then((res) => {
      setEventTagsData(res.data);
    }).catch((err) => {
      console.log(err);
    })

    axios.get('/listLocations').then((res) => {
      setEventLocationsData(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  const today = new Date();

  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventTags, setEventTags] = useState([]);
  const [eventTagsData, setEventTagsData] = useState([]);
  const [eventLocation, setEventLocation] = useState(0);
  const [eventLocationsData, setEventLocationsData] = useState([]);
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventFinishTime, setEventFinishTime] = useState('');

  const [isSingleFocus, setIsSingleFocus] = useState(false);
  const [isMultiFocus, setIsMultiFocus] = useState(false);
  const [isDatePickerVisibleStartTime, setDatePickerVisibilityStartTime] = useState(false);
  const [isDatePickerVisibleFinishTime, setDatePickerVisibilityFinishTime] = useState(false);
  const [loading, setLoading] = useState(false);

  const data = {
    event_name: eventName,
    event_description: eventDescription,
    event_location: eventLocation,
    event_start_time: eventStartTime,
    event_finish_time: eventFinishTime,
    event_tags: eventTags
  };

  const showDatePickerStartTime = () => {
    setDatePickerVisibilityStartTime(true);
  };

  const hideDatePickerStartTime = () => {
    setDatePickerVisibilityStartTime(false);
  };

  const showDatePickerFinishTime = () => {
    setDatePickerVisibilityFinishTime(true);
  };

  const hideDatePickerFinishTime = () => {
    setDatePickerVisibilityFinishTime(false);
  };

  const handleConfirmStartTime = (startDate) => {
    if (today.getTime() > startDate.getTime()) {
      hideDatePickerStartTime();
    } else {
      setEventStartTime(startDate)
      hideDatePickerStartTime();
    }
  };

  const handleConfirmFinishTime = (finishDate) => {
    if (today.getTime() > finishDate.getTime() || eventStartTime.getTime() > finishDate.getTime()) {
      hideDatePickerFinishTime();
    } else {
      setEventFinishTime(finishDate)
      hideDatePickerFinishTime();
    }
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

        navigation.navigate('UpcomingEvents');
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        navigation.navigate('UpcomingEvents');
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
          data={eventLocationsData}
          maxHeight={300}
          labelField="name"
          valueField="pk"
          placeholder={!isSingleFocus ? 'Event Location' : '...'}
          value={eventLocation}
          onFocus={() => setIsSingleFocus(true)}
          onBlur={() => setIsSingleFocus(false)}
          onChange={item => {
            setEventLocation(item.pk);
            setIsSingleFocus(false);
          }}
        />
        <MultiSelect
          style={[styles.multiDropdown, isMultiFocus && { borderBottomWidth: 2, borderBottomColor: 'purple' }]}
          placeholderStyle={styles.multiPlaceholderStyle}
          selectedTextStyle={styles.multiSelectedTextStyle}
          data={eventTagsData}
          labelField="tag_name"
          valueField="id"
          placeholder="Event Tags"
          value={eventTags}
          onFocus={() => setIsMultiFocus(true)}
          onChange={item => {
            setEventTags(item);
            setIsMultiFocus(false);
          }}
          selectedStyle={styles.multiSelectedStyle}
          inside={true}
        />
        <View style={styles.date}>
          <View style={styles.startDate}>
            <Button style={styles.dateButton} onPress={showDatePickerStartTime}>
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
              isVisible={isDatePickerVisibleStartTime}
              onConfirm={handleConfirmStartTime}
              onCancel={hideDatePickerStartTime}
            />
          </View>
          <View style={styles.endDate}>
            <Button style={styles.dateButton} onPress={showDatePickerFinishTime}>
              <Text style={styles.dateText}>
                {eventFinishTime ? eventFinishTime.toLocaleDateString() : "End Time "}
              </Text>
              <AntDesign name="calendar" size={28}
                style={styles.dateIcon}
                color={'purple'}

              />
            </Button>
            <DateTimePickerModal
              mode="datetime"
              isVisible={isDatePickerVisibleFinishTime}
              onConfirm={handleConfirmFinishTime}
              onCancel={hideDatePickerFinishTime}
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
    color: 'gray'
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
    color: 'gray'
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
