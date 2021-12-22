import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { data } from "./data";


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const UpcomingEventsScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={data}
                keyExtractor={item => item.key}
                contentContainerStyle={{ padding: 16 }}
                renderItem={item => {
                    return (
                        <TouchableOpacity style={{ marginBottom: 16, height: height * 0.40 }} onPress={() => { }}>
                            <View style={{ flex: 1, padding: 16 }}>
                                <View
                                    style={
                                        [StyleSheet.absoluteFillObject,
                                        { backgroundColor: '#C0D6E4', borderRadius: 16 },
                                        ]}
                                />
                                <Image style={styles.image} source={{ uri: item.item.image }} />
                                <Text style={styles.name}>{item.item.name}</Text>
                                <Text style={styles.description}>Location: {item.item.location}</Text>
                                <Text style={styles.description}>Date: {item.item.date}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default UpcomingEventsScreen;

const styles = StyleSheet.create({
    name: {
        marginTop: -12,
        fontWeight: '700',
        fontSize: 18,
        color: "black",
    },
    description: {
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 14,
        opacity: 0.7
    },
    image: {
        marginLeft: -16,
        marginTop: -42,
        width: width * 0.92,
        height: height * 0.31,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        resizeMode: 'contain',
    }

});
