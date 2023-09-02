import { Anchor, Text } from 'grommet';
import React from 'react';

import { contactEmail } from '../../shared/js/constants';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import AppBar from '../../shared/react/AppBar';

function Privacy() {
  return (
    <>
      <AppBar title="Privacy" hasBack />
      <ContentWrapper>
        <Text>
          1. File37 encrypts your data by default. You can check how encryption works{' '}
          <Anchor label="here" href="/encryption" target="_blank" />.
        </Text>

        <Text margin="1rem 0 0">2. File37 has no tracking;</Text>

        <Text margin="1rem 0 0">
          3. File37 doesn't sell third party ads, and it never sells your data. File37 makes
          money through paid customers.
        </Text>

        <Text margin="1rem 0 0">4. File37 doesn't save your payment info;</Text>

        <Text margin="1rem 0 0">
          Contact me for anything:{' '}
          <Anchor label={contactEmail} href={`mailto:${contactEmail}`} target="_blank" />
        </Text>
      </ContentWrapper>
    </>
  );
}

export default Privacy;
