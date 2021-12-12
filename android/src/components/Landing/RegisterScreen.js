
import React, { useState } from 'react';
import { Button, TextInput, RadioButton, Text } from 'react-native-paper';
import Ionicons, { FontAwesome, Foundation, SimpleLineIcons } from 'react-native-vector-icons/Ionicons';
import { DatePickerInput } from 'react-native-paper-dates';
import { ScrollView } from 'react-native';
import axios from 'axios';


const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [preferredGender, setPreferredGender] = useState('');
    const [birthdate, setBirthdate] = useState(undefined);

    const renderMaleRadioButton = (<><Ionicons name="male" size={24} /><Text> Male</Text></>);
    const renderFemaleRadioButton = (<><Ionicons name="female" size={24} /><Text> Female</Text></>);
    const renderBothRadioButton = (<><Ionicons name="male" size={24} /><Ionicons name="female" size={24} /><Text> Both</Text></>);

    const onRegisterSubmit = () => {
        axios.get(`https://jsonplaceholder.typicode.com/users`).then(res => {
            const persons = res.data;
            console.log(persons);
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
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
            />

            <DatePickerInput
                locale="en-GB"
                label="Birthdate"
                value={birthdate}
                onChange={(d) => setBirthdate(d)}
                inputMode="start"
            //mode="outlined"
            />
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
