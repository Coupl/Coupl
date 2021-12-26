const currentEvent = (state = {
    eventInfo: null,
    state: EventStates.NOT_IN_EVENT,
    likedUsers: [],
    match: null
}, action) => {
    switch (action.type) {
        case "JOIN_EVENT":
            return {
                ...state,
                eventInfo: action.payload,
                state: EventStates.IN_EVENT,
                likedUsers: [],
                match: null
            }
        case "LEAVE_EVENT":
            return {
                ...state,
                eventInfo: null,
                state: EventStates.NOT_IN_EVENT,
                likedUsers: [],
                match: null
            }
        case "START_MATCHING":
            return {
                ...state,
                state: EventStates.IN_MATCHING
            }
        case "STOP_MATCHING":
            return {
                ...state,
                state: EventStates.IN_EVENT
            }
        case "LIKE_USER":
            const newLikedUsers = [...state.likedUsers, action.payload];
            return {
                ...state,
                likedUsers: newLikedUsers
            }
        case "FOUND_MATCH":
            return {
                ...state,
                match: action.payload
            }
        case "REMOVE_MATCH":
            return {
                ...state,
                match: null
            }
        case "SKIP_USER":
            return state
        default:
            return state
    }
}

export const EventStates = {
    NOT_IN_EVENT: "NOT_IN_EVENT",
    IN_EVENT: "IN_EVENT",
    IN_MATCHING: "IN_MATCHING",
};

export default currentEvent;