import { Anchor, Heading, Text } from 'grommet';
import { Copy } from 'grommet-icons';
import React from 'react';
import { useLocation } from 'wouter';
import Price from '../../components/Price';
import { apps } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import DeleteAccountLink from '../../shared/react/DeleteAccountLink';
import LogoutLink from '../../shared/react/LogoutLink';
import PaymentStatus from '../../shared/react/PaymentStatus';
import copyToClipboard from '../../shared/react/copyToClipboard';
import { privacyUrl, termsUrl } from '../../shared/react/initShared';

function Tickets({ account, isLoading, onToast }) {
  const [location] = useLocation();

  return (
    <>
      <AppBar title="Buy tickets" isLoading={isLoading} hasBack={location === '/tickets'} />
      <ContentWrapper>
        <Price />

        <Spacer />
        <PaymentStatus app={apps.file37.name} showBuyButton={false} />
        <Divider />

        {!!account && (
          <>
            <Heading margin="1rem 0 0" level="3">
              Buy ticket
            </Heading>

            <Text margin="1rem 0 0">You can buy ticket at my stripe page.</Text>

            <Text margin="1rem 0 0">
              1. Please add your username to the "Your Encrypt37 username" field when checkout.
            </Text>
            <Text margin="1rem 0 0">
              Your username: {account.username}{' '}
              <Copy
                onClick={() => {
                  copyToClipboard(account.username);
                  onToast('Copied!');
                }}
              />
            </Text>

            <Text margin="1rem 0 0">
              2.{' '}
              <Anchor
                label="Buy 1 year ticket for $60 (SAVE 16.6%)"
                href={process.env.REACT_APP_ENCRYPT37_STRIPE_1_YEAR_URL}
                target="_blank"
              />{' '}
              or{' '}
              <Anchor
                label="Buy 1 month ticket for $6"
                href={process.env.REACT_APP_ENCRYPT37_STRIPE_1_MONTH_URL}
                target="_blank"
              />
            </Text>

            <Text margin="1rem 0 0">3. After payment, come back to this page and refresh.</Text>

            <Spacer />
            <Divider />
            <Spacer />

            <LogoutLink />
            <Spacer />
            <DeleteAccountLink />
            <Spacer />
            <Anchor label="Privacy" href={privacyUrl} target="_blank" />
            <Spacer />
            <Anchor label="Terms" href={termsUrl} target="_blank" />
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Tickets;
