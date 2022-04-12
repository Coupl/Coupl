export const selectCurrentEvent = state => state.currentEvent;
export const selectLikedUsers = state => state.currentEvent.likedUsers;
export const selectMatch = state => state.currentEvent.match;
export const selectUser = state => state.currentUser.user;
export const selectAuthorizationInfo = state => state.currentUser.authorization;