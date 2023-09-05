import { Box, Text } from 'grommet';
import React from 'react';

import { useXMargin } from '../../hooks/useXMargin';

function SelectedGroups({ groupsObj, selectedGroups }) {
  const margin = useXMargin();

  if (!selectedGroups?.length || !groupsObj) {
    return null;
  }

  return (
    <Box direction="row" wrap margin={margin}>
      {(selectedGroups || []).map(group => {
        const groupObj = groupsObj[group.id];
        if (!groupObj) {
          return null;
        }

        return (
          <Text key={group.id} weight="bold" size="small" margin="0 1rem 0 0">
            #{groupObj.title}
          </Text>
        );
      })}
    </Box>
  );
}

export default SelectedGroups;
