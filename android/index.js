/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';
import configureStore from './src/redux/reducers/configureStore';
import {Provider} from 'react-redux';
 
const store = configureStore();

const AppWithProvider = () => (
    <Provider store={store}>
      <App />
    </Provider>
  );

AppRegistry.registerComponent(appName, () => AppWithProvider);
