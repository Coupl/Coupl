/**
 * @format
 */

import 'intl'; 
import 'intl/locale-data/jsonp/en';
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
import axios from 'axios';
import Toast from 'react-native-toast-message';

const store = configureStore();
registerTranslation('en-GB', enGB);

axios.defaults.baseURL = 'https://coupl-bilkent.herokuapp.com/';

const WrappedApp = () => (
    <StoreProvider store={store}>
        <PaperProvider>
            <App />
            <Toast />
        </PaperProvider>
    </StoreProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
