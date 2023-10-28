import React from 'react';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import ExpiredBanner from './components/ExpiredBanner';
import NavBar from './components/NavBar';
import Router from './router';
import apps from './shared/js/apps';
import createTheme from './shared/react-pure/createTheme';
import AppContainer from './shared/react/AppContainer';
import Door from './shared/react/Door';
import Enable2FABanner from './shared/react/Enable2FABanner';
import Toast from './shared/react/Toast';
import { HooksOutsieWrapper, setHook } from './shared/react/hooksOutside';
import initShared from './shared/react/initShared';
import store from './store';

initShared({
  logo: `${process.env.REACT_APP_ASSETS_FOR_CODE}/encrypt37-logo-231017.png`,
  app: apps.file37.name,
  privacyUrl: 'https://encrypt37.com/privacy/',
  termsUrl: 'https://encrypt37.com/terms/',
});

setHook('location', useLocation);
setHook('dispatch', useDispatch);

const theme = createTheme(apps.file37.color);

function App() {
  return (
    <StoreProvider store={store}>
      <AppContainer theme={theme}>
        <ExpiredBanner />
        <Enable2FABanner />
        <NavBar />
        <Router />
        <Toast />
      </AppContainer>
      <HooksOutsieWrapper />
      <Door />
    </StoreProvider>
  );
}

export default App;
