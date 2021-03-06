
import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useStore } from 'react-redux';
import allActions from '../../redux/actions';
import { authorize } from '../Common/authorization/Oauth2Authorization';


const LoginScreen = ({ navigation }) => {

    const store = useStore();
    const setUserAction = allActions.userActions.setUser;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onLoginSubmit = async () => {
        setLoading(true);

        await authorize(store, username, password);
        res = await axios.get('userType/');
        const userType = res.data;

        if (userType === "User") {
            axios.get(`getProfile/`).then(res => {
                const userInfo = res.data;

                if (!userInfo) {
                    Toast.show({
                        type: 'error',
                        text1: 'Wrong username number and/or password',
                    });

                    return;
                }
                store.dispatch(setUserAction(userInfo));
                Toast.show({
                    type: 'success',
                    text1: 'Login is Successful',
                });

                setLoading(false);

                navigation.navigate('UserProfileCheck');
            }).catch((err) => {
                setLoading(false);
                console.log(err.response);
            });
        }

        if (userType === "Coordinator") {
            axios.get(`getCoordinator/`).then(res => {
                const coordinatorInfo = res.data;

                if (!coordinatorInfo) {
                    Toast.show({
                        type: 'error',
                        text1: 'Wrong username number and/or password',
                    });

                    return;
                }
                store.dispatch(setUserAction(coordinatorInfo));
                Toast.show({
                    type: 'success',
                    text1: 'Login is Successful',
                });

                setLoading(false);

                navigation.navigate('CoordinatorNavigation');
            }).catch((err) => {
                setLoading(false);
                console.log(err.response);
            });
        }

    }

    const renderLoginButton = () => {
        if (loading) {
            return (
                <ActivityIndicator size={"large"} />
            );
        }

        return (
            <Button
                style={styles.button}
                mode="contained"
                onPress={onLoginSubmit}
            >
                Login
            </Button>
        );
    }

    return (

        <View style={styles.container}>
            <ImageBackground source={require("./welcomeBackground.png")} resizeMode="cover" style={styles.image}>
                <View style={styles.innerContainer}>
                    <Image
                        style={styles.logo}
                        source={require('./couplLogo.png')}
                    />
                    <TextInput
                        style={styles.textInput}
                        label="Username"
                        value={username}
                        onChangeText={text => setUsername(text)}
                    />
                    <TextInput
                        style={styles.textInput}
                        label="Password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />

                    {renderLoginButton()}

                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    innerContainer: {
        margin: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: "100%",
        flex: 1,
    },
    logo: {
        width: "80%",
        height: "20%",
        resizeMode: 'contain',
    },
    button: {
        margin: 10,
        width: 150,
        height: 40,
        borderRadius: 20,
    },
    textInput: {
        margin: 5,
        width: 200,
        height: 60,
    },
});

export default LoginScreen;
