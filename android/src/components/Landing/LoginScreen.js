
import React, { useState } from 'react';
import { Button, TextInput} from 'react-native-paper';
import { ScrollView } from 'react-native';
import axios from 'axios';  
import Toast from 'react-native-toast-message';


const LoginScreen = ({ navigation }) => {

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const onLoginSubmit = () => {
        const loginData = {phoneNumber: phone, password: password};
        //axios.post(``, loginData).then(res => { });
        Toast.show({
            type: 'success',
            text1: 'Login is Successful',
        });
        navigation.navigate('UserNavigation');
    }

    return (
        <ScrollView>
            <TextInput
                label="Phone"
                value={phone}
                onChangeText={text => setPhone(text)}
            />
            <TextInput
                label="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={text => setPassword(text)}
            />

            <Button
                mode="contained"
                onPress={onLoginSubmit}
            >
                Login
            </Button>
        </ScrollView>
    );
};

export default LoginScreen;
