import { MatchStates } from "../reducers/currentEvent"

const joinEvent = (eventInfo) => {
    return {
        type: "JOIN_EVENT",
        payload: eventInfo
    }
}

const leaveEvent = () => {
    return {
        type: "LEAVE_EVENT"
    }
}

const startMatching = () => {
    return {
        type: "START_MATCHING"
    }
}

const stopMatching = () => {
    return {
        type: "STOP_MATCHING"
    }
}

const setActiveMatch = (matchInfo) => {
    return {
        type: "SET_ACTIVE_MATCH",
        payload: matchInfo
    }
}

const acceptActiveMatch = () => {
    return {
        type: "ACCEPT_ACTIVE_MATCH"
    }
}

export default {
    joinEvent,
    leaveEvent,
    startMatching,
    stopMatching,
    setActiveMatch,
    acceptActiveMatch
}