import { Anchor, Box, Spinner, Text } from 'grommet';
import React from 'react';
import { STORAGE_LIMIT_IN_GB, getUsagePercentage } from '../../lib/storageLimit';
import apps from '../../shared/js/apps';
import { formatDateTime } from '../../shared/js/date';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import AppVersion from '../../shared/react/AppVersion';
import ChangeTheme from '../../shared/react/ChangeTheme';
import PaymentStatus from '../../shared/react/PaymentStatus';
import RouteLink from '../../shared/react/RouteLink';
import { getFileSizeString } from '../../shared/react/file';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { privacyUrl, termsUrl } from '../../shared/react/initShared';

function Account({
  account,
  settings,
  isLoadingAccount,
  isLoadingSettings,
  onFetchSettings,
  onLogOut,
}) {
  useEffectOnce(() => {
    onFetchSettings(apps.file37.name, true);
  });
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
            <PaymentStatus app={apps.file37.name} showBuyButton />
            <Divider />
            <Spacer />
            <Box margin="0 0 1rem" direction="row" align="center">
              <Text margin="0 1rem 0 0">
                Storage size: {getFileSizeString(settings?.size || 0)} / {STORAGE_LIMIT_IN_GB}GB (
                {getUsagePercentage(settings?.size || 0)}%)
              </Text>
              {isLoadingSettings && <Spinner size="small" />}
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
            <Anchor
              label="How encryption works?"
              href="https://encrypt37.com/encryption"
              target="_blank"
            />
            <Spacer />
            <RouteLink label="Pricing" to="/pricing" />
            <Spacer />
            <RouteLink label="Buy tickets" to="/tickets" />
            <Spacer />
            <Anchor label="Privacy" href={privacyUrl} target="_blank" />
            <Spacer />
            <Anchor label="Terms" href={termsUrl} target="_blank" />
            <Spacer />
            <Anchor label="Contact" href="https://encrypt37.com/contact" target="_blank" />
            <Spacer />
            <Divider />
            <Spacer />
            <Anchor label="Log out" onClick={onLogOut} />
            <Spacer />
            <Divider />
            <Spacer />
            <AppVersion />
            <Text size="small">Since 2023</Text>
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Account;
