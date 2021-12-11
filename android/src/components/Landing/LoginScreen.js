
import React from 'react';
import {
    Button,
} from 'react-native';


const LoginScreen = ({ navigation }) => {
    
    return (
        <Button
            title="Login"
            onPress={() =>
                navigation.navigate('UserNavigation')
            }
        />
    );
};

export default LoginScreen;
