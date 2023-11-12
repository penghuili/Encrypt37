import { Button, Heading } from 'grommet';
import React from 'react';
import TryForFree from '../../components/TryForFree';
import { apps } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';

function Expired({ isTrying, onTry }) {
  return (
    <>
      <AppBar title="Try Encrypt37!" isLoading={isTrying} />
      <ContentWrapper>
        <Heading margin="0">Try Encrypt37!</Heading>
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
      </ContentWrapper>
    </>
  );
}

export default Expired;
