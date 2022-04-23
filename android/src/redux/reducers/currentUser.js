const currentUser = (state = {
    user: null,
    loggedIn: false,
    authorization: {
        oauthToken: null
    }
}, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                loggedIn: true
            }
        case "CHANGE_HOBBIES":
            return {
                ...state,
                user: {
                    ...state.user,
                    hobbies: action.payload
                }
            }
        case "SET_AUTHORIZATION_INFO":
            return {
                ...state,
                authorization: action.payload
            }
        case "LOG_OUT":
            return {
                ...state,
                user: null,
                loggedIn: false
            }
        default:
            return state
    }
}

export default currentUser;