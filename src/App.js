import React from 'react';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';

import logo from './assets/logo.png';
import Router from './router';
import apps from './shared/js/apps';
import createTheme from './shared/react-pure/createTheme';
import AppContainer from './shared/react/AppContainer';
import Door from './shared/react/Door';
import { HooksOutsieWrapper, setHook } from './shared/react/hooksOutside';
import initShared from './shared/react/initShared';
import Toast from './shared/react/Toast';
import store from './store';

initShared({ logo, app: apps.file37.name });

setHook('location', useLocation);
setHook('dispatch', useDispatch);

const theme = createTheme(apps.file37.color);

function App() {
  return (
    <StoreProvider store={store}>
      <AppContainer theme={theme}>
        <Router />

        <Toast />
      </AppContainer>
      <HooksOutsieWrapper />

      <Door />
    </StoreProvider>
  );
}

export default App;
