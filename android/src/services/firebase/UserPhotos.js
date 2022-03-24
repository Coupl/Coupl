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


export const getUserPhotos = async (userId) => {
    const numPhotos = 6;
    let photos = ["", "", "", "", "", ""];
    const photoNames = Array.from(Array(numPhotos).keys()).map((index) => (userId + "_photo" + (index + 1)));
    console.log(photoNames);

    for (let i = 0; i < numPhotos; i++) {
        const photoName = photoNames[i];
        try {
            const response = await storage().ref(photoName).getDownloadURL();
            photos[i] = response;
        } catch (error) {
            photos[i] = "";
        }
    }

    return photos;

};