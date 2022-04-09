import axios from "axios";

const setUser = (userObj) => {
    userObj.userId = userObj.user.pk;
    return {
        type: "SET_USER",
        payload: userObj
    }
}

const setAuthorizationInfo = (authorizationInfo) => {
    return {
        type: "SET_AUTHORIZATION_INFO",
        payload: authorizationInfo
    }
}

const logOut = () => {
    return {
        type: "LOG_OUT"
    }
}

export default {
    setUser,
    logOut,
    setAuthorizationInfo
}