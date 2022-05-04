/**
 * @format
 */

import 'intl';
import 'intl/locale-data/jsonp/en';
import React from 'react';
import { AppRegistry } from 'react-native';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {
    enGB,
    registerTranslation
} from 'react-native-paper-dates';
import Toast from 'react-native-toast-message';
import { Provider as StoreProvider } from 'react-redux';
import App from './App';
import { name as appName } from './app.json';
import configureStore from './src/redux/reducers/configureStore';

import {
    setCustomText
} from 'react-native-global-props';

const customTextProps = {
    style: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'Roboto',
        color: 'black'
    }
};

const store = configureStore();
registerTranslation('en-GB', enGB);
setCustomText(customTextProps);

const fontConfig = {
    web: {
        regular: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
    },
    ios: {
        regular: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
    },
    android: {
        regular: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
        },
    }
};

const theme = {
    ...DefaultTheme,
    roundness: 2,
    fonts: configureFonts(fontConfig)
};


const WrappedApp = () => (
    <StoreProvider store={store}>
        <PaperProvider theme={theme}>
            <App />
            <Toast />
        </PaperProvider>
    </StoreProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
