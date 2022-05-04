import axios from "axios";
import Toast from 'react-native-toast-message';
import allActions from "../../../redux/actions";

const CLIENT_ID = "ocdpfY0OOZEQldkfmZeOIeuwr4wTK1dYd914pOx0";

function getQueryString(data = {}) {
    return Object.entries(data)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

export const authorize = async (store, username, password) => {

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: getQueryString
    };
    const body = {
        client_id: CLIENT_ID,
        grant_type: "password",
        username: username,
        password: password
    }

    let res = null;

    try {
        res = await axios.post("o/token/", body, config);
    } catch (err) {
        Toast.show({
            type: 'error',
            text1: 'Authorization error, please check your login information.',
        });

        return;
    }
    const token = res.data.access_token;
    const refreshToken = res.data.refresh_token;

    const authorizationInfo = {
        token: token,
        refreshToken: refreshToken
    }

    store.dispatch(allActions.userActions.setAuthorizationInfo(authorizationInfo));

    //TODO: this gives some extra time for the axios interceptor to update
    //Works for now, but find a better way. 
    await new Promise(r => setTimeout(r, 100));
} 