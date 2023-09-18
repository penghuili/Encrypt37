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
import Expired from '../views/Expired';
import FileUpdate from '../views/FileUpdate';
import Groups from '../views/Groups';
import GroupsReorder from '../views/GroupsReorder';
import GroupUpdate from '../views/GroupUpdate';
import Maintenance from '../views/Maintenance';
import PostDetails from '../views/PostDetails';
import Posts from '../views/Posts';
import PostUpdate from '../views/PostUpdate';
import Pricing from '../views/Pricing';
import Privacy from '../views/Privacy';
import Tickets from '../views/Tickets';
import Welcome from '../views/Welcome';

function Router({ isCheckingRefreshToken, isLoggedIn, isLoadingSettings, trid, isExpired }) {
  if (process.env.REACT_APP_MAINTENANCE === 'true') {
    return <Maintenance />;
  }

  if (isCheckingRefreshToken || isLoadingSettings) {
    return (
      <HorizontalCenter justify="center" margin="3rem 0 0">
        <Spinner size="large" />
      </HorizontalCenter>
    );
  }

  if (isLoggedIn) {
    if (!trid || isExpired) {
      return (
        <Switch>
          <Route path="/expired" component={Expired} />

          <Route path="/account" component={Account} />
          <Route path="/security" component={Security} />
          <Route path="/security/2fa" component={Setup2FA} />
          <Route path="/security/password" component={ChangePassword} />
          <Route path="/tickets" component={Tickets} />
          <Route path="/pricing" component={Pricing} />

          <Route path="/encryption" component={Encryption} />
          <Route path="/privacy" component={Privacy} />

          <Route path="/" component={Expired} />
          <Route>{() => <Redirect to="/" />}</Route>
        </Switch>
      );
    }

    return (
      <Switch>
        <Route path="/posts" component={Posts} />
        <Route path="/posts/:postId" component={PostDetails} />
        <Route path="/posts/:postId/update" component={PostUpdate} />
        <Route path="/files/:fileId/update" component={FileUpdate} />

        <Route path="/groups" component={Groups} />
        <Route path="/groups/reorder" component={GroupsReorder} />
        <Route path="/groups/:groupId/update" component={GroupUpdate} />

        <Route path="/account" component={Account} />
        <Route path="/security" component={Security} />
        <Route path="/security/2fa" component={Setup2FA} />
        <Route path="/security/password" component={ChangePassword} />
        <Route path="/tickets" component={Tickets} />
        <Route path="/pricing" component={Pricing} />

        <Route path="/encryption" component={Encryption} />
        <Route path="/privacy" component={Privacy} />

        <Route path="/" component={Posts} />
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
      <Route path="/pricing" component={Pricing} />

      <Route path="/" component={Welcome} />
      <Route>{() => <Redirect to="/" />}</Route>
    </Switch>
  );
}

export default Router;
