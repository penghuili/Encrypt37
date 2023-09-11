import { Anchor, Box, Spinner, Text } from 'grommet';
import React from 'react';

import { formatDateTime } from '../../shared/js/date';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import AppVersion from '../../shared/react/AppVersion';
import ChangeTheme from '../../shared/react/ChangeTheme';
import RouteLink from '../../shared/react/RouteLink';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { getFileSizeString } from '../../shared/react/file';

function Account({
  account,
  settings,
  isLoadingAccount,
  isLoadingFileSettings,
  onFetchSettings,
  onLogOut,
}) {
  useEffectOnce(onFetchSettings);

  return (
    <>
      <AppBar title="Account" hasBack />
      <ContentWrapper>
        {isLoadingAccount && <Spinner />}
        {!!account?.userId && (
          <>
            <Text margin="0 0 1rem">Username: {account.username}</Text>
            <Text margin="0 0 1rem">User ID: {account.userId}</Text>
            <Text margin="0 0 1rem">Created at: {formatDateTime(account.createdAt)}</Text>
            <Divider />
            <Spacer />
            <Box margin="0 0 1rem" direction="row" align="center">
              <Text margin="0 1rem 0 0">
                Storage size: {getFileSizeString(settings?.size || 0)}
              </Text>
              {isLoadingFileSettings && <Spinner size="small" />}
            </Box>
            <Divider />
            <Spacer />
            <ChangeTheme />
            <Divider />
            <Spacer />
            <RouteLink label="Security" to="/security" />
            <Spacer />
            <Divider />
            <Spacer />
            <RouteLink label="How encryption works?" to="/encryption" />
            <Spacer />
            <RouteLink label="Privacy" to="/privacy" />
            <Spacer />
            <Anchor label="Contact" href="https://peng37.com/contact" target="_blank" />
            <Spacer />
            <Divider />
            <Spacer />
            <Anchor label="Log out" onClick={onLogOut} />
            <Spacer />
            <Divider />
            <Spacer />
            <AppVersion />
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Account;
