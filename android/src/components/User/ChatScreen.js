
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const ChatScreen = ({ navigation, route }) => {
    const { profile } = route.params;
    const fullName = profile.name + " " + profile.surname;
    const scrollViewRef = useRef();

    const [messages, setMessages] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {

        const updateChat = () => {
            const postBody = { other_user_id: profile.user.pk };

            axios.post('getChat/', postBody).then((res) => {
                setMessages(res.data)
            }).catch((err) => {
                console.log(err.response);
            });
        }

        updateChat();

        const intervalId = setInterval(() => {
            updateChat();
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        navigation.setOptions({ title: "Chat with " + fullName });
    }, []);

    if (!messages) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={200} color="#0000ff" />
                <Text style={{ textAlign: "center", fontSize: 30, padding: 10 }}> Please wait</Text>
            </View>
        )
    }

    const sendMessage = () => {
        setCurrentMessage("");

        const postBody = { receiver_id: profile.user.pk, content: currentMessage };

        axios.post('sendMessage/', postBody).then((res) => {
            setMessages(res.data)
        }).catch((err) => {
            console.log(err.response);
        })
    }

    return (
        <View style={{ ...styles.container }}>
            <View style={{ flex: 9 }}>
                <ScrollView
                    style={{ flex: 1 }}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
                >
                    {messages.map((message, index) => {

                        const alignment = (message.receiver === profile.user.pk) ? "flex-end" : "flex-start";

                        return (
                            <View
                                key={index}
                                style={{ alignSelf: alignment, margin: 5, padding: 5, backgroundColor: "DCDCDC", borderColor: "gray", borderWidth: 2, borderRadius: 10 }}
                            >
                                <Text>{message.content}</Text>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>

            <View style={{ flex: 1, padding: 5, justifyContent: "center", alignItems: "center", backgroundColor: "gray", flexDirection: "row" }}>
                <TextInput
                    style={{ flex: 5, height: "100%" }}
                    value={currentMessage}
                    placeholder="Write your message"
                    onChangeText={text => { setCurrentMessage(text) }}
                />
                <Button
                    style={{}}
                    title="Send"
                    onPress={() => { sendMessage() }}
                >
                </Button>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        margin: 10,
        borderColor: "gray",
        backgroundColor: "#DCDCDC",
        borderWidth: 2,
        borderRadius: 10,
    }
});


export default ChatScreen;