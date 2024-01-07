import { Box, Text } from 'grommet';
import React from 'react';
import RouteLink from '../../shared/react/RouteLink';

function ExpiredBanner({ isExpired }) {
  if (!isExpired) {
    return null;
  }

  return (
    <Box align="center">
      <Box border={{ color: 'status-critical' }} pad="0.5rem" round="small" margin="1rem 0 0">
        <Text>Your account is expired.</Text>
        <Text>
          You can buy a ticket <RouteLink label="here" to="/tickets" />.
        </Text>
      </Box>
    </Box>
  );
}

export default ExpiredBanner;
