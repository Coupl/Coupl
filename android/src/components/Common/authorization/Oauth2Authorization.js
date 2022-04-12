import axios from "axios"
import { useStore } from "react-redux";
import allActions from "../../../redux/actions";

const CLIENT_ID = "2GfSgx7YIZzZXzvv9bymtb8KtEKJTn5Vwt09ne79";

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

    const res = await axios.post("o/token/", body, config);
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