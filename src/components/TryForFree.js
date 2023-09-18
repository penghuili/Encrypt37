import { Text } from 'grommet';
import React from 'react';

function TryForFree() {
  return (
    <>
      <Text>You can try File37 for free for 14 days.</Text>
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
      <Text>
        You will get{' '}
        <Text color="brand" weight="bold">
          500GB
        </Text>{' '}
        storage.
      </Text>
    </>
  );
}

export default TryForFree;
