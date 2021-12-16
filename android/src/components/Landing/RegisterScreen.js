
import React, { useState } from 'react';
import { Button, TextInput, RadioButton, Text } from 'react-native-paper';
import Ionicons, { FontAwesome, Foundation, SimpleLineIcons } from 'react-native-vector-icons/Ionicons';
import { DatePickerInput } from 'react-native-paper-dates';
import { ScrollView } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';


const RegisterScreen = ({ navigation }) => {

    const pageChangeTimeout = 1000; //In milliseconds

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [preferredGender, setPreferredGender] = useState('');
    const [birthdate, setBirthdate] = useState(undefined);

    const renderMaleRadioButton = (<><Ionicons name="male" size={24} /><Text> Male</Text></>);
    const renderFemaleRadioButton = (<><Ionicons name="female" size={24} /><Text> Female</Text></>);
    const renderBothRadioButton = (<><Ionicons name="male" size={24} /><Ionicons name="female" size={24} /><Text> Both</Text></>);

    const onRegisterSubmit = () => {
        const userData = { username: phone, password: password };
        axios.post(`http://10.0.2.2:8000/`, userData).then(res => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Your account is successfully registered.'
            });
            
            //Go to the login screen after a timeout
            setTimeout(()=> {navigation.navigate('LoginScreen');}, pageChangeTimeout);

        }).catch(err => {
            let errors = "";
            let errorData = err.response.data;
            for (var key in errorData) {
                var value = errorData[key];
                errors = errors + value + "\n";
            }

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errors
            });
        });
    }

    return (
        <ScrollView>
            <TextInput
                label="Name"
                value={name}
                onChangeText={text => setName(text)}
            />
            <TextInput
                label="Surname"
                value={surname}
                onChangeText={text => setSurname(text)}
            />

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

            {
                <DatePickerInput
                    locale="en-GB"
                    label="Birthdate"
                    value={birthdate}
                    onChange={(d) => setBirthdate(d)}
                    inputMode="start"
                //mode="outlined"
                />
            }
            <Text >Your gender:</Text>
            <RadioButton.Group onValueChange={value => setGender(value)} value={gender}>
                <RadioButton.Item label={renderMaleRadioButton} value="Male" />
                <RadioButton.Item label={renderFemaleRadioButton} value="Female" />
            </RadioButton.Group>

            <Text >Preferred gender:</Text>
            <RadioButton.Group onValueChange={value => setPreferredGender(value)} value={preferredGender}>
                <RadioButton.Item label={renderMaleRadioButton} value="Male" />
                <RadioButton.Item label={renderFemaleRadioButton} value="Female" />
                <RadioButton.Item label={renderBothRadioButton} value="Both" />
            </RadioButton.Group>

            <Button
                mode="contained"
                onPress={onRegisterSubmit}
            >
                Register
            </Button>
        </ScrollView>
    );
};

export default RegisterScreen;
