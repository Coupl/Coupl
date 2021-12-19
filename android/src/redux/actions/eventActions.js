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

export default {
    joinEvent,
    leaveEvent,
    startMatching,
    stopMatching
}