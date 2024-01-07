import { Text } from 'grommet';
import React from 'react';
import Price from '../../components/Price';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import RouteLink from '../../shared/react/RouteLink';

function Pricing({ isLoggedIn }) {
  return (
    <>
      <AppBar title="Pricing" hasBack />
      <ContentWrapper>
        <Price />

        {isLoggedIn && (
          <>
            <Spacer />
            <Text>
              Buy tickets <RouteLink label="here >>" to="/tickets" />
            </Text>
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Pricing;
