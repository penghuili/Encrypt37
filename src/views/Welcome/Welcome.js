import { Anchor, Heading, Image } from 'grommet';
import React from 'react';

import Pitch from '../../components/Pitch';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import ChangeTheme from '../../shared/react/ChangeTheme';
import { privacyUrl, termsUrl } from '../../shared/react/initShared';
import RouteLink from '../../shared/react/RouteLink';

function Welcome() {
  return (
    <>
      <ContentWrapper>
        <HorizontalCenter margin="2rem 0 1rem">
          <Image src={`${process.env.REACT_APP_ASSETS_FOR_CODE}/logo.png`} width="48px" />{' '}
          <Heading level="2" margin="0 0 0 1rem">
            Encrypt37
          </Heading>
        </HorizontalCenter>
        <Pitch />
        <Spacer size="2rem" />

        <RouteLink to="/sign-up" label="Sign up" />
        <Spacer />
        <RouteLink to="/sign-in" label="Sign in" />

        <Spacer />
        <Divider />
        <Spacer />

        <Anchor label="How encryption works?" href="https://encrypt37.com/encryption" target="_blank" />
        <Spacer />
        <RouteLink label="Pricing" to="/pricing" />
        <Spacer />
        <Anchor label="Privacy" href={privacyUrl} target="_blank" />
        <Spacer />
        <Anchor label="Terms" href={termsUrl} target="_blank" />
        <Spacer />
        <Anchor label="Contact" href="https://encrypt37.com/contact" target="_blank" />

        <Spacer />
        <Divider />
        <Spacer />

        <ChangeTheme />
      </ContentWrapper>
    </>
  );
}

export default Welcome;
