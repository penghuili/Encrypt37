import { Anchor, Avatar, Heading, Text } from 'grommet';
import React from 'react';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import ChangeTheme from '../../shared/react/ChangeTheme';
import { logo } from '../../shared/react/initShared';

function Maintenance() {
  return (
    <>
      <ContentWrapper>
        <HorizontalCenter margin="2rem 0 1rem">
          <Avatar src={logo} />{' '}
          <Heading level="2" margin="0 0 0 1rem">
            Encrypt37
          </Heading>
        </HorizontalCenter>

        <Text>Encrypt37 is under maintenance for now. Please check back later.</Text>

        <Spacer size="4rem" />
        <Anchor label="Contact" href="https://peng37.com/contact" target="_blank" />

        <Spacer />
        <Divider />
        <Spacer />

        <ChangeTheme />
      </ContentWrapper>
    </>
  );
}

export default Maintenance;
