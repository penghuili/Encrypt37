import { Box, Tag, Text } from 'grommet';
import React from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';

function GroupFilter({ groups, selectedGroup, onSelect }) {
  const margin = useXMargin();

  if (!groups?.length) {
    return null;
  }

  const safeGroups = groups || [];
  return (
    <>
      <Box direction="row" wrap margin={margin}>
        {safeGroups.map(group => {
          const isSelected = group.sortKey === selectedGroup?.sortKey;
          return (
            <Tag
              key={group.sortKey}
              value={
                <Text color={isSelected ? 'brand' : undefined} size="small">
                  {group.title}
                </Text>
              }
              onClick={() => {
                if (isSelected) {
                  onSelect(null);
                } else {
                  onSelect(group);
                }
              }}
              size="small"
              margin="0 1rem 1rem 0"
            />
          );
        })}
      </Box>
      <Divider />
      <Spacer />
    </>
  );
}

export default GroupFilter;
