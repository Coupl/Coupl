
import React from 'react';
import type { Node } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
} from 'react-native';


const WelcomeScreen = ({ navigation }) => {
    
    return (
        <Button
            title="Login"
            onPress={() =>
                navigation.navigate('Home')
            }
        />
    );
};

export default WelcomeScreen;
