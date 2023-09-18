import { Button, Heading, Text } from 'grommet';
import React from 'react';

import TryForFree from '../../components/TryForFree';
import apps from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import RouteLink from '../../shared/react/RouteLink';

function GroupUpdate({ isTrying, tried, onTry }) {
  function renderContent() {
    if (!tried) {
      return (
        <>
          <Heading margin="0">Try File37!</Heading>
          <TryForFree />
          <Spacer size="2rem" />

          <Button
            primary
            size="large"
            color="brand"
            label="Start trying"
            onClick={() => onTry(apps.file37.name)}
            disabled={isTrying}
          />
        </>
      );
    }

    return (
      <>
        <Text>Your account is expired.</Text>
        <Text>
          You can buy a ticket <RouteLink label="here" to="/tickets" />.
        </Text>
      </>
    );
  }

  return (
    <>
      <AppBar title={tried ? 'Your account is expired' : 'Try File37!'} isLoading={isTrying} />
      <ContentWrapper>{renderContent()}</ContentWrapper>
    </>
  );
}

export default GroupUpdate;
