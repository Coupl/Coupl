
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text, TouchableOpacity, View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useStore } from 'react-redux';
import allActions from '../../redux/actions';
import axios from 'axios'

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useIsFocused } from '@react-navigation/native';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useState } from 'react';
import { render } from 'react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod';

const QRCodeScannerTimeout = 1000;
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {

    const store = useStore();
    const joinEventAction = allActions.eventActions.joinEvent;
    const [renderScanner, setRenderScanner] = useState(false);
    const [scanQRCode, setScanQRCode] = useState(true);

    const joinEvent = (eventId) => {
        axios.get('getEvent?event_id=' + eventId).then((res) => {
            var eventInfo = res.data;
            eventInfo.numParticipants = 25; //Add this to the actual response later
            store.dispatch(joinEventAction(eventInfo));
            navigation.navigate('EventNavigation');
        }).catch((err) => {
            console.log(err.response);
        });
    }

    const onRead = e => {
        if (!scanQRCode) return;

        const url = e.data;
        const eventId = url.split("=")[1];

        const eventInfo = {
            eventName: "Rastgele bir etkinlik",
            eventDescription: "eventDescription",
            numParticipants: 25,
            eventFinishTime: "eventFinishTime"
        }
        store.dispatch(joinEventAction(eventInfo));
        navigation.navigate('EventNavigation');
        //joinEvent(eventId);

        setRenderScanner(false);
        setScanQRCode(false);
        setTimeout(() => {setScanQRCode(true)}, 10000);
    }

    const onPreviewClick = () => {
        setRenderScanner(true);
    }

    const QRScanner = () => {
        const isFocused = useIsFocused();
        return (
            <>
                {isFocused && <QRCodeScanner
                    onRead={onRead}
                    flashMode={RNCamera.Constants.FlashMode.torch}
                    reactivate={true} //Can be used again
                    reactivateTimeout={QRCodeScannerTimeout}
                    /*
                    bottomContent={
                        <Button
                            mode="contained"
                            onPress={() => joinEvent(7)}
                        >
                            Check Out the Upcoming Events
                        </Button>
                    }
                    */
                />
                }
            </>
        )
    }

    const Preview = () => {
        return (
            <>
                <TouchableOpacity style={styles.qrScannerPreview} onPress={onPreviewClick}>
                    <AntDesign name="camera" size={120}
                        color={'#fff'}
                    >
                    </AntDesign>
                </TouchableOpacity>

                <Text style={styles.text}>Enter an Event by Scanning a QR Code</Text>
                <Text style={styles.text}>OR</Text>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('UpcomingEventsScreen')}
                >
                    Check Out the Upcoming Events
                </Button>
            </>
        )
    }
    
    return (
        <View style={styles.container}>
            {renderScanner ? <QRScanner /> : <Preview />}
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
    qrScannerPreview: {
        backgroundColor: "black",
        width: width,
        height: height * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
