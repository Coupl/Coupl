export const selectCurrentEvent = state => state.currentEvent;
export const selectActiveMatch = state => state.currentEvent.activeMatch;
export const selectActiveMatchDecision = state => state.currentEvent.activeMatchDecision;
export const selectUser = state => state.currentUser.user;
export const selectAuthorizationInfo = state => state.currentUser.authorization;