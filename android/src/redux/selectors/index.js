export const selectCurrentEvent = state => state.currentEvent;
export const selectActiveMatchProfile = state => state.currentEvent.activeMatch?.profile;
export const selectActiveMatchDetails = state => state.currentEvent.activeMatch?.match;
export const selectActiveMatchDecision = state => state.currentEvent.activeMatchDecision;
export const selectUser = state => state.currentUser.user;
export const selectAuthorizationInfo = state => state.currentUser.authorization;