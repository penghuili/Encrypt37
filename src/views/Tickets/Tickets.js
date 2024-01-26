import { Anchor } from 'grommet';
import React from 'react';
import { useLocation } from 'wouter';
import { apps } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import DeleteAccountLink from '../../shared/react/DeleteAccountLink';
import LogoutLink from '../../shared/react/LogoutLink';
import PaymentStatus from '../../shared/react/PaymentStatus';
import TicketLinks from '../../shared/react/TicketLinks';
import { privacyUrl, termsUrl } from '../../shared/react/initShared';

function Tickets({ account, isLoading }) {
  const [location] = useLocation();

  return (
    <>
      <AppBar title="Buy tickets" isLoading={isLoading} hasBack={location === '/tickets'} />
      <ContentWrapper>
        <PaymentStatus app={apps.Encrypt37.name} showBuyButton={false} />
        <Divider />
        <Spacer />

        {!!account && (
          <>
            <TicketLinks app={apps.Encrypt37.name} />

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
