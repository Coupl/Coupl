import storage, { firebase } from '@react-native-firebase/storage';
const { v4: uuidv4 } = require('uuid');

export const uploadPhoto = async (userId, photo, slot) => {

    const uri = photo.path;
    const filename = uuidv4();
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    const task = storage()
        .ref(filename)
        .putFile(uploadUri);

    try {
        await task;
        return filename;
    } catch (e) {
        console.error(e);
        return null;
    }
};


export const getPhotoURL = async (photoName) => {
    try {
        const response = await storage().ref(photoName).getDownloadURL();
        return response;
    } catch (error) {
        return null;
    }
};