
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text, View
} from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors';
import ProfileScreen from '../User/ProfileScreen';

const Checker = ({ navigation }) => {

    const [loading, setLoading] = useState(true);
    const user = useSelector(selectUser);

    useEffect(() => {
        if (user.profile_pictures.length >= 1 && user.hobbies.length >= 3)
            navigation.navigate('UserNavigation');
        else
            setLoading(false);
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size={200} />
                <Text style={{ fontSize: 30 }}>Checking account details.</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, padding: 30, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ marginVertical: 20, fontSize: 30 }}>You need to add at least 1 profile picture and choose at least 3 hobbies in your profile before using Coupl.</Text>
            <Button
                style={{ marginVertical: 20 }}
                mode="contained"
                onPress={() => { navigation.navigate("ProfileScreen") }}
            >
                Edit Profile
            </Button>
            {
                (user.profile_pictures.length >= 1 && user.hobbies.length >= 3) &&
                <Button
                    style={{}}
                    mode="contained"
                    onPress={() => {
                        if (user.profile_pictures.length >= 1 && user.hobbies.length >= 3) {
                            navigation.navigate("UserNavigation")
                        }
                        else {
                            if (user.profile_pictures.length < 1) {

                                Toast.show({
                                    type: 'error',
                                    text1: 'You still don\'t have enough profile pictures',
                                });
                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'You still don\'t have enough hobbies',
                                });
                            }
                        }
                    }}
                >
                    I am done
                </Button>
            }

        </View>
    )

}

const UserProfileCheck = ({ navigation }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Checker" component={Checker} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
    )

};

export default UserProfileCheck;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderColor: "gray",
        backgroundColor: "#DCDCDC",
        borderWidth: 2,
        borderRadius: 20,
    },
    text: {
        fontSize: 18,
    },
    qrScannerPreview: {
        backgroundColor: "black",
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
