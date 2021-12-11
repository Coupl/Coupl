/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import React from 'react';
import { name as appName } from './app.json';
import configureStore from './src/redux/reducers/configureStore';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import {
    enGB,
    registerTranslation,
  } from 'react-native-paper-dates'

const store = configureStore();
registerTranslation('en-GB', enGB);

const WrappedApp = () => (
    <StoreProvider store={store}>
        <PaperProvider>
            <App />
        </PaperProvider>
    </StoreProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
