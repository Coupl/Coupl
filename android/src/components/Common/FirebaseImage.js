
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Image,
    View
} from 'react-native';
import { getPhotoURL } from '../../services/firebase/UserPhotos';

const FirebaseImage = ({ imageName: imageName, ...rest }) => {

    const [state, setState] = useState({
        loading: true,
        URL: null
    });

    useEffect(() => {
        getPhotoURL(imageName).then((imageURL) => {
            setState({
                loading: false,
                URL: imageURL
            });
        }).catch((err) => {
            setState({
                loading: false,
                URL: "https://place-hold.it/200x200" //TODO: Maybe show an error image?
            });
        });
    }, []);

    if (state.loading) return (
        <View style={{...rest.style, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator/>
        </View>
    )

    return (
        <Image
            source={{ uri: state.URL }}
            {...rest}
        />
    );
};

export default FirebaseImage;
