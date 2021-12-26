
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { Image, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';


const LoginScreen = ({ navigation }) => {

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const onLoginSubmit = () => {
        const loginData = { phoneNumber: phone, password: password };
        //axios.post(``, loginData).then(res => { });
        Toast.show({
            type: 'success',
            text1: 'Login is Successful',
        });
        navigation.navigate('UserNavigation');
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
                        label="Phone"
                        value={phone}
                        onChangeText={text => setPhone(text)}
                    />
                    <TextInput
                        style={styles.textInput}
                        label="Password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />

                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={onLoginSubmit}
                    >
                        Login
                    </Button>
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
