
import axios from 'axios';
import React, { useState } from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';



const UserRegisterScreen = ({ navigation }) => {

    const pageChangeTimeout = 1000; //In milliseconds

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [gender, setGender] = useState('');
    const [preferredGender, setPreferredGender] = useState('');
    const [birthdate, setBirthdate] = useState(undefined);

    const renderMaleRadioButton = (<><Ionicons name="male" size={24} /><Text> Male</Text></>);
    const renderFemaleRadioButton = (<><Ionicons name="female" size={24} /><Text> Female</Text></>);
    const renderBothRadioButton = (<><Ionicons name="male" size={24} /><Ionicons name="female" size={24} /><Text> Both</Text></>);

    const onRegisterSubmit = () => {
        const fields = [
            { val: name, name: "Name" },
            { val: surname, name: "Surname" },
            { val: username, name: "Username" },
            { val: password, name: "Password" },
            { val: phone, name: "Phone" },
            { val: gender, name: "Gender" },
            { val: preferredGender, name: "Match Preference" },
            { val: birthdate, name: "Birth date" },

        ]

        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].val) {
                Toast.show({
                    type: 'error',
                    text1: 'Missing fields',
                    text2: 'Enter a ' + fields[i].name
                });
                return;
            }
        }

        if (password !== passwordConfirm) {
            Toast.show({
                type: 'error',
                text1: 'Passwords do not match',
                text2: 'Re-enter your passwords.'
            });
            return;
        }

        const bdateString = birthdate.toISOString()
        const birthdateISO8601 = bdateString.substring(0, bdateString.indexOf("T"));

        const postBody = {
            user: {
                username: username,
                password: password,
            },
            name: name,
            surname: surname,
            phone: phone,
            date_of_birth: birthdateISO8601,
            description: "Edit me",
            gender: gender,
            preference: preferredGender,
            sexual_orientation: "Heterosexual"
        };

        axios.post("/createProfile/", postBody).then(res => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Your account is successfully registered.'
            });

            //Go to the login screen after a timeout
            setTimeout(() => { navigation.navigate('LoginScreen'); }, pageChangeTimeout);

        }).catch(err => {
            console.log(err);
            let errors = "";
            let errorData = err.response.data;
            for (var key in errorData) {
                var value = errorData[key];
                errors = errors + key + ": " + value + "\n";
            }

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errors
            });
        });
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require("./welcomeBackground.png")} resizeMode="cover" style={{ flex: 1, width: "100%" }}>
                <View style={{ flex: 1, padding: 20, alignItems: "center", justifyContent: "center" }}>
                    <Image
                        style={{
                            width: "80%",
                            height: "10%",
                            resizeMode: 'contain',
                        }}
                        source={require('./couplLogo.png')}
                    />
                    <View style={{ height: 70, flexDirection: "row" }}>
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Name"
                            value={name}
                            onChangeText={text => setName(text)}
                        />
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Surname"
                            value={surname}
                            onChangeText={text => setSurname(text)}
                        />
                    </View>

                    <View style={{ height: 70, flexDirection: "row" }}>
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Username"
                            value={username}
                            onChangeText={text => setUsername(text)}
                        />
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Phone"
                            value={phone}
                            onChangeText={text => setPhone(text)}
                        />
                    </View>

                    <View style={{ height: 70, flexDirection: "row" }}>
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Confirm Password"
                            value={passwordConfirm}
                            onChangeText={text => setPasswordConfirm(text)}
                        />
                    </View>


                    <View style={styles.textInput}>
                        <DatePickerInput

                            locale="en-GB"
                            label="Birthdate"
                            value={birthdate}
                            onChange={(d) => setBirthdate(d)}
                            inputMode="start"
                        //mode="outlined"
                        />
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 5 }}>

                        <View style={{ flex: 1, backgroundColor: "rgba(231,231,231,1)", borderRadius: 20, padding: 10, margin: 5, alignItems: "center" }}>
                            <Text >I am:</Text>
                            <RadioButton.Group onValueChange={value => setGender(value)} value={gender}>
                                <RadioButton.Item labelStyle={{ fontSize: 13 }} label={renderMaleRadioButton} value="Male" />
                                <RadioButton.Item labelStyle={{ fontSize: 13 }} label={renderFemaleRadioButton} value="Female" />
                            </RadioButton.Group>
                        </View>

                        <View style={{ flex: 1, backgroundColor: "rgba(231,231,231,1)", borderRadius: 20, padding: 10, margin: 5, justifyContent: "center", alignItems: "center" }}>
                            <Text >Match me with:</Text>
                            <RadioButton.Group onValueChange={value => setPreferredGender(value)} value={preferredGender}>
                                <RadioButton.Item labelStyle={{ fontSize: 13 }} label={renderMaleRadioButton} value="0" />
                                <RadioButton.Item labelStyle={{ fontSize: 13 }} label={renderFemaleRadioButton} value="1" />
                                <RadioButton.Item labelStyle={{ fontSize: 13 }} label={renderBothRadioButton} value="2" />
                            </RadioButton.Group>
                        </View>
                    </View>

                    <Button
                        style={{ margin: 5, width: 200, height: 40, borderRadius: 10 }}
                        mode="contained"
                        onPress={onRegisterSubmit}
                    >
                        Register
                    </Button>

                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};


const CoordinatorRegisterScreen = ({ navigation }) => {

    const pageChangeTimeout = 1000; //In milliseconds

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const onRegisterSubmit = () => {
        const fields = [
            { val: name, name: "Name" },
            { val: surname, name: "Surname" },
            { val: username, name: "Username" },
            { val: password, name: "Password" },
            { val: phone, name: "Phone" },
        ]

        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].val) {
                Toast.show({
                    type: 'error',
                    text1: 'Missing fields',
                    text2: 'Enter a ' + fields[i].name
                });
                return;
            }
        }

        if (password !== passwordConfirm) {
            Toast.show({
                type: 'error',
                text1: 'Passwords do not match',
                text2: 'Re-enter your passwords.'
            });
            return;
        }

        const postBody = {
            user: {
                username: username,
                password: password,
            },
            coordinator_name: name + " " + surname,
            coordinator_phone: phone,
            coordinator_details: "Edit me"
        };

        axios.post("createCoordinator/", postBody).then(res => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Your account is successfully registered.'
            });

            //Go to the login screen after a timeout
            setTimeout(() => { navigation.navigate('LoginScreen'); }, pageChangeTimeout);

        }).catch(err => {
            console.log(err);
            let errors = "";
            let errorData = err.response.data;
            for (var key in errorData) {
                var value = errorData[key];
                errors = errors + key + ": " + value + "\n";
            }

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errors
            });
        });
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require("./welcomeBackground.png")} resizeMode="cover" style={{ flex: 1, width: "100%" }}>
                <View style={{ flex: 1, padding: 20, alignItems: "center", justifyContent: "center" }}>
                    <Image
                        style={{
                            width: "80%",
                            height: "20%",
                            resizeMode: 'contain',
                        }}
                        source={require('./couplLogo.png')}
                    />
                    <View style={{ height: 70, flexDirection: "row" }}>
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Name"
                            value={name}
                            onChangeText={text => setName(text)}
                        />
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Surname"
                            value={surname}
                            onChangeText={text => setSurname(text)}
                        />
                    </View>

                    <View style={{ height: 70, flexDirection: "row" }}>
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Username"
                            value={username}
                            onChangeText={text => setUsername(text)}
                        />
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Phone"
                            value={phone}
                            onChangeText={text => setPhone(text)}
                        />
                    </View>

                    <View style={{ height: 70, flexDirection: "row" }}>
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                        <TextInput
                            style={styles.doubleTextInput}
                            label="Confirm Password"
                            value={passwordConfirm}
                            onChangeText={text => setPasswordConfirm(text)}
                        />
                    </View>

                    <Button
                        style={{ margin: 5, width: 200, height: 40, borderRadius: 10 }}
                        mode="contained"
                        onPress={onRegisterSubmit}
                    >
                        Register
                    </Button>

                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const RegisterScreen = ({ navigation }) => {

    const [userType, setUserType] = useState("User");

    return (
        <View style={{ flex: 1 }}>
            {userType === "User" ?
                <UserRegisterScreen navigation={navigation}/> :
                <CoordinatorRegisterScreen navigation={navigation}/>
            }
            
            <Text
                style={{position: "absolute", bottom: 10, right: 10, color: "white"}}
                mode="contained"
                onPress={() => {
                    if (userType === "User")
                        setUserType("Coordinator")
                    else
                        setUserType("User")
                }}
            >
                I'm {userType === "User" ? "an event organizer" : "a user"}
            </Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
    marginedBlock: {
        marginBottom: 10
    },
    textInput: {
        margin: 5,
        width: 200,
        height: 60,
    },
    doubleTextInput: {
        flex: 1,
        margin: 5,
        height: 60,
        width: 200
    },
});

export default RegisterScreen;
