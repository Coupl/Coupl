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

const likeUser = (user) => {
    return {
        type: "LIKE_USER",
        payload: user
    }
}

const skipUser = (user) => {
    return {
        type: "SKIP_USER",
        payload: user
    }
}

const foundMatch = (match) => {
    return {
        type: "FOUND_MATCH",
        payload: match
    }
}

const removeMatch = () => {
    return {
        type: "REMOVE_MATCH"
    }
}


export default {
    joinEvent,
    leaveEvent,
    startMatching,
    stopMatching,
    likeUser,
    skipUser,
    foundMatch,
    removeMatch,
}