const currentEvent = (state = {}, action) => {
    switch(action.type){
        case "JOIN_EVENT":
            return {
                ...state,
                eventInfo: action.payload,
                participating: true
            }
        case "LEAVE_EVENT":
            return {
                ...state,
                eventInfo: {},
                participating: false
            }
        default:
            return state
    }
}

export default currentEvent;