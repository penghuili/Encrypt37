import { Spinner } from 'grommet';
import React from 'react';
import { Redirect, Route, Switch } from 'wouter';

import HorizontalCenter from '../shared/react-pure/HorizontalCenter';
import ChangePassword from '../shared/react/ChangePassword';
import Security from '../shared/react/Security';
import Setup2FA from '../shared/react/Setup2FA';
import SignIn from '../shared/react/SignIn';
import SignUp from '../shared/react/SignUp';
import Verify2FA from '../shared/react/Verify2FA';
import Account from '../views/Account';
import Encryption from '../views/Encryption';
import Files from '../views/Files';
import FilesUpload from '../views/FilesUpload';
import GroupAdd from '../views/GroupAdd';
import GroupsReorder from '../views/GroupsReorder';
import GroupUpdate from '../views/GroupUpdate';
import Privacy from '../views/Privacy';
import Welcome from '../views/Welcome';

function Router({ isCheckingRefreshToken, isLoggedIn }) {
  if (isCheckingRefreshToken) {
    return (
      <HorizontalCenter justify="center" margin="3rem 0 0">
        <Spinner size="large" />
      </HorizontalCenter>
    );
  }

  if (isLoggedIn) {
    return (
      <Switch>
        <Route path="/files" component={Files} />
        <Route path="/files/upload" component={FilesUpload} />

        <Route path="/groups/add" component={GroupAdd} />
        <Route path="/groups/:groupId/update" component={GroupUpdate} />
        <Route path="/groups/:groupId/reorder" component={GroupsReorder} />

        <Route path="/account" component={Account} />
        <Route path="/security" component={Security} />
        <Route path="/security/2fa" component={Setup2FA} />
        <Route path="/security/password" component={ChangePassword} />

        <Route path="/encryption" component={Encryption} />
        <Route path="/privacy" component={Privacy} />

        <Route path="/" component={Files} />
        <Route>{() => <Redirect to="/" />}</Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/sign-up" component={SignUp} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/sign-in/2fa" component={Verify2FA} />

      <Route path="/encryption" component={Encryption} />
      <Route path="/privacy" component={Privacy} />

      <Route path="/" component={Welcome} />
      <Route>{() => <Redirect to="/" />}</Route>
    </Switch>
  );
}

export default Router;
