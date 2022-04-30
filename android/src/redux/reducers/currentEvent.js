const currentEvent = (state = {
    eventInfo: null,
    state: EventStates.NOT_IN_EVENT,
    activeMatch: null,
    activeMatchDecision: null
}, action) => {
    switch (action.type) {
        case "JOIN_EVENT":
            return {
                ...state,
                eventInfo: action.payload,
                state: EventStates.IN_EVENT,
                activeMatch: null,
                activeMatchDecision: null
            }
        case "LEAVE_EVENT":
            return {
                ...state,
                eventInfo: null,
                state: EventStates.NOT_IN_EVENT,
                activeMatch: null,
                activeMatchDecision: null
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
        case "SET_ACTIVE_MATCH":
            return {
                ...state,
                activeMatch: action.payload
            }
        case "ACCEPT_ACTIVE_MATCH":
            return {
                ...state,
                activeMatch: true
            }
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