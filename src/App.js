import React from 'react';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import NavBar from './components/NavBar';
import Router from './router';
import { apps } from './shared/js/apps';
import createTheme from './shared/react-pure/createTheme';
import AppContainer from './shared/react/AppContainer';
import Door from './shared/react/Door';
import Enable2FABanner from './shared/react/Enable2FABanner';
import Toast from './shared/react/Toast';
import { HooksOutsieWrapper, setHook } from './shared/react/hooksOutside';
import initShared from './shared/react/initShared';
import store from './store';

initShared({
  logo: 'https://static.peng37.com/faviconapi/52190fe8-4549-4a16-b25b-3b42954128bc/ad57b4975e3b5add4004281dc78d909b63dd26be286caa3fc815a1c1e57ff8c2/icon-192.png',
  app: apps.Encrypt37.name,
  encryptionUrl: 'https://peng37.com/encryption/',
  privacyUrl: 'https://encrypt37.com/privacy/',
  termsUrl: 'https://encrypt37.com/terms/',
  hasSettings: true,
});

setHook('location', useLocation);
setHook('dispatch', useDispatch);

const theme = createTheme(apps.Encrypt37.color);

function App() {
  return (
    <StoreProvider store={store}>
      <AppContainer theme={theme}>
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
