
import React from 'react';
import {
    Text,
} from 'react-native';
import { Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
    return (
        <>
            <Text>Burası ana ekran, analiz raporundaki ui resimlerine göre sadece qr code tarama şeyi olacak</Text>
            <Button
                mode="contained"
                onPress={() => navigation.navigate('EventNavigation')}
            >
                Test için rastgele evente girme tuşu
            </Button>
        </>
    );
};

export default HomeScreen;
