import moment from 'moment';
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

const ProfilePhotoSwiper = ({ profile, renderBottom }) => {

    let slides = [];

    if (profile.profile_pictures.length === 0) {
        slides = [{
            key: 0,
            title: "Add a picture first",
            description: "",
            url: ""
        }];
    } else {
        slides = profile.profile_pictures.map((picture, index) => {
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
                    {/*
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
                        */}
                    
                </FirebaseImageBackground>
            </View>
        );
    }

    const nameDisplay = profile.name + " " + profile.surname[0] + ".";
    const age = moment().diff(profile.date_of_birth, 'years');
    const infoDisplay = nameDisplay + ", " + age;

    const renderPagination = (activeIndex) => {
        return (
            <View style={styles.paginationContainer}>
                <SafeAreaView style={{ flex: 1 }}>
                    {renderBottom && renderBottom()}
                    <View style={styles.profileInfoContainer}>
                        <Text style={styles.profileInfo}>{infoDisplay}</Text>
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
    profileInfoContainer: {
        backgroundColor: 'rgba(130, 130, 130, 0.7)',
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 5,
    },
    profileInfo: {
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

export default ProfilePhotoSwiper;
