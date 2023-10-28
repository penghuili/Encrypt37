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
import Files from '../views/Files';
import GroupUpdate from '../views/GroupUpdate';
import Groups from '../views/Groups';
import Maintenance from '../views/Maintenance';
import OnThisDay from '../views/OnThisDay';
import PostAdd from '../views/PostAdd';
import PostDetails from '../views/PostDetails';
import PostUpdate from '../views/PostUpdate';
import Posts from '../views/Posts';
import Pricing from '../views/Pricing';
import Privacy from '../views/Privacy';
import Tickets from '../views/Tickets';
import TryIt from '../views/TryIt';
import Welcome from '../views/Welcome';

function Router({ isCheckingRefreshToken, isLoggedIn, isLoadingSettings, tried, isExpired }) {
 
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
    if (!tried) {
      return <TryIt />;
    }

    if (isExpired) {
      return (
        <Switch>
          <Route path="/posts" component={Posts} />
          <Route path="/posts/:postId" component={PostDetails} />
          <Route path="/on-this-day" component={OnThisDay} />
          <Route path="/files" component={Files} />

          <Route path="/account" component={Account} />
          <Route path="/security" component={Security} />
          <Route path="/security/2fa" component={Setup2FA} />
          <Route path="/security/password" component={ChangePassword} />
          <Route path="/tickets" component={Tickets} />
          <Route path="/pricing" component={Pricing} />

          <Route path="/privacy" component={Privacy} />

          <Route path="/" component={Posts} />
          <Route>{() => <Redirect to="/" />}</Route>
        </Switch>
      );
    }

    return (
      <Switch>
        <Route path="/posts" component={Posts} />
        <Route path="/posts/add" component={PostAdd} />
        <Route path="/posts/:postId" component={PostDetails} />
        <Route path="/posts/:postId/update" component={PostUpdate} />
        <Route path="/on-this-day" component={OnThisDay} />
        <Route path="/files" component={Files} />

        <Route path="/groups" component={Groups} />
        <Route path="/groups/:groupId/update" component={GroupUpdate} />

        <Route path="/account" component={Account} />
        <Route path="/security" component={Security} />
        <Route path="/security/2fa" component={Setup2FA} />
        <Route path="/security/password" component={ChangePassword} />
        <Route path="/tickets" component={Tickets} />
        <Route path="/pricing" component={Pricing} />

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

      <Route path="/privacy" component={Privacy} />
      <Route path="/pricing" component={Pricing} />

      <Route path="/" component={Welcome} />
      <Route>{() => <Redirect to="/" />}</Route>
    </Switch>
  );
}

export default Router;
