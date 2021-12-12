
import React from 'react';
import { Button } from 'react-native-paper';


const WelcomeScreen = ({ navigation }) => {

    return (
        <>
            <Button
                mode="contained"
                onPress={() => navigation.navigate('LoginScreen')}
            >
                Login
            </Button>
            <Button
                mode="contained"
                onPress={() => navigation.navigate('RegisterScreen') }
            >
                Register
            </Button>
        </>
    );
};

export default WelcomeScreen;
