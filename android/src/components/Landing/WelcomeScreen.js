
import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';


const WelcomeScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <ImageBackground source={require("./welcomeBackground.png")} resizeMode="cover" style={styles.image}>
                <View style={styles.innerContainer}>
                    <Image
                        style={styles.logo}
                        source={require('./couplLogo.png')}
                    />
                    <Button
                        style={styles.button}
                        color="green"
                        mode="contained"
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <Text style={styles.buttonText}> Login </Text>
                    </Button>
                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => navigation.navigate('RegisterScreen')}
                    >
                       <Text style={styles.buttonText}> Register </Text>
                    </Button>
                    <Text
                        style={styles.bottomRightButton}
                        mode="contained"
                        onPress={() => navigation.navigate('RegisterScreen')}
                    >
                        I'm an event organizer
                    </Text>
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
        margin: 20,
        padding: 5,
        width: 200,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 22,
        color: "white",
    },
    bottomRightButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        color: "white"
    }
});

export default WelcomeScreen;
