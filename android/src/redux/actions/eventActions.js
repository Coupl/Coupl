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

export default {
    joinEvent,
    leaveEvent
}