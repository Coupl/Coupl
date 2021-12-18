import {combineReducers} from 'redux';
import currentUser from './currentUser';
import currentEvent from './currentEvent';

const reducers = combineReducers({
    currentUser,
    currentEvent
});
export default reducers;