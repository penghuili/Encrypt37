import { Text } from 'grommet';
import React from 'react';
import { useLocation } from 'wouter';

import RouteLink from '../shared/react/RouteLink';

function Pitch({ showHome }) {
  const [location] = useLocation();

  return (
    <>
      <Text margin="0 0 1rem">
        Cloud storage. <RouteLink label="Encrypted" to="/encryption" />.
      </Text>
      <Text>
        All your files and texts are encrypted on your device before they are sent to the server.
      </Text>
      <Text>No one can read it but you.</Text>
      {showHome && location !== '/' && <RouteLink label="← Back to home" to="/" />}
    </>
  );
}

export default Pitch;
