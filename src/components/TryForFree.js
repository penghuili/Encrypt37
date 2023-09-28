import { Text } from 'grommet';
import React from 'react';

import { STORAGE_LIMIT_IN_GB } from '../lib/storageLimit';
import Pitch from './Pitch';

function TryForFree() {
  return (
    <>
      <Pitch />
      <Text margin="2rem 0 0">You can try File37 for free for 14 days.</Text>
      <Text>
        After that, it's only <Text color="brand">$6 / month</Text> or{' '}
        <Text color="brand" weight="bold">
          $60 / year
        </Text>{' '}
        <Text color="status-ok" weight="bold">
          (SAVE 16.6%)
        </Text>
        .
      </Text>
      <Text margin="2rem 0 0">
        You will get{' '}
        <Text color="brand" weight="bold">
          {STORAGE_LIMIT_IN_GB}GB
        </Text>{' '}
        storage.
      </Text>
    </>
  );
}

export default TryForFree;
