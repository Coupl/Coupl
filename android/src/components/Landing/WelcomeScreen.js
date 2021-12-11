
import React from 'react';
import {
    Button,
} from 'react-native';


const WelcomeScreen = ({ navigation }) => {

    return (
        <>
            <Button
                title="Login"
                onPress={() =>
                    navigation.navigate('LoginScreen')
                }
            />
            <Button
                title="Register"
                onPress={() =>
                    navigation.navigate('RegisterScreen')
                }
            />
        </>
    );
};

export default WelcomeScreen;
