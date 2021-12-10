import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './index';

export default function configureStore() {
  return createStore(reducers, composeWithDevTools(
      applyMiddleware(thunk)
    ));
}