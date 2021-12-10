/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import React from 'react';
import { name as appName } from './app.json';
import configureStore from './src/redux/reducers/configureStore';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

const store = configureStore();

const WrappedApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
