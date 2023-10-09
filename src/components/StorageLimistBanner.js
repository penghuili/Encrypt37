import { Anchor, Text } from 'grommet';
import React from 'react';

import { useXMargin } from '../hooks/useXMargin';
import { STORAGE_LIMIT_IN_GB } from '../lib/storageLimit';
import Divider from '../shared/react-pure/Divider';
import Spacer from '../shared/react-pure/Spacer';

function StorageLimistBanner({ canUpload }) {
  const margin = useXMargin();

  if (canUpload) {
    return null;
  }

  return (
    <>
      <Text margin={margin} color="status-warning">
        You have reached the storage limit of {STORAGE_LIMIT_IN_GB}GB. Please{' '}
        <Anchor href="https://encrypt37.com/contact/" target="_blank">
          contact
        </Anchor>{' '}
        me if you need more storage.
      </Text>
      <Spacer />
      <Divider />
      <Spacer />
    </>
  );
}

export default StorageLimistBanner;
