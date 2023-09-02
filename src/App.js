import React from 'react';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';

import logo from './assets/logo.png';
import Pitch from './components/Pitch';
import Router from './router';
import apps from './shared/js/apps';
import ContentWrapper from './shared/react-pure/ContentWrapper';
import createTheme from './shared/react-pure/createTheme';
import Divider from './shared/react-pure/Divider';
import Spacer from './shared/react-pure/Spacer';
import AppContainer from './shared/react/AppContainer';
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

        <ContentWrapper as="footer">
          <Spacer />
          <Divider />
          <Spacer />
          <Pitch showHome />
        </ContentWrapper>

        <Toast />
      </AppContainer>
      <HooksOutsieWrapper />
    </StoreProvider>
  );
}

export default App;
