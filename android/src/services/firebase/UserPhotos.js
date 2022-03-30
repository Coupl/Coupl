import storage, { firebase } from '@react-native-firebase/storage';

export const uploadPhoto = async (userId, photo, slot) => {

    const uri = photo.path;
    const filename = userId + "_" + "photo" + slot;
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    const task = storage()
        .ref(filename)
        .putFile(uploadUri);

    try {
        await task;
    } catch (e) {
        console.error(e);
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