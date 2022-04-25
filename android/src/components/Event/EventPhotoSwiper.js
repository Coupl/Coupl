import React from 'react';
import {
    Dimensions,
    SafeAreaView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Popover from 'react-native-popover-view';
import AntDesign from "react-native-vector-icons/AntDesign";
import FirebaseImageBackground from '../Common/FirebaseImageBackground';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const EventPhotoSwiper = ({ event }) => {

    let slides = [];

    if (event.event_location.location_picture.length === 0) {
        //TODO: add a "NO IMAGE" image for this case
    } else {
        slides = event.event_location.location_picture.map((picture, index) => {
            return {
                key: "" + index,
                title: picture.title,
                description: picture.description,
                url: picture.url
            }
        });
    }

    const renderItem = ({ item }) => {
        return (
            <View>
                <FirebaseImageBackground style={styles.image} imageName={item.url}>
                    <Popover
                        from={(
                            <TouchableOpacity style={{ marginTop: 10 }}>
                                <AntDesign name="infocirlce" size={35} color="white" />
                            </TouchableOpacity>
                        )}>
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.text}>{item.description}</Text>
                        </View>
                    </Popover>
                </FirebaseImageBackground>
            </View>
        );
    }

    const nameDisplay = event.event_name + " | " + event.event_location.name;

    const renderPagination = (activeIndex) => {
        return (
            <View style={styles.paginationContainer}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.eventInfoContainer}>
                        <Text style={styles.eventInfo}>{nameDisplay}</Text>
                    </View>
                    <View style={styles.paginationDots}>
                        {slides.length > 1 &&
                            slides.map((_, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.dot,
                                        i === activeIndex
                                            ? { backgroundColor: 'white' }
                                            : { backgroundColor: 'rgba(0, 0, 0, .2)' },
                                    ]}
                                />
                            ))}
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <AppIntroSlider renderItem={renderItem} renderPagination={renderPagination} data={slides}>
            </AppIntroSlider>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "600"
    },
    text: {
        fontSize: 16
    },
    image: {
        height: width,
        width: width,
        alignItems: "center"
    },
    eventInfoContainer: {
        backgroundColor: 'rgba(130, 130, 130, 0.7)',
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 5,
    },
    eventInfo: {
        fontSize: 26,
        fontWeight: "600",
        color: "white",
        padding: 3,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 5,
        left: 16,
        right: 16,
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 30,
        height: 4,
        borderRadius: 5,
        marginHorizontal: 4,
    }
});

export default EventPhotoSwiper;
