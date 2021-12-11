
import React from 'react';
import {
    Button,
} from 'react-native';


const RegisterScreen = ({ navigation }) => {
    
    return (
        <Button
            title="Register"
            onPress={() =>
                navigation.navigate('UserNavigation')
            }
        />
    );
};

export default RegisterScreen;
