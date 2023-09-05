import { Box, Tag, Text } from 'grommet';
import React from 'react';

import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import { useXMargin } from '../../hooks/useXMargin';

function GroupFilter({ groups, selectedGroup, onSelect }) {
  const margin = useXMargin();

  if (!groups?.length) {
    return null;
  }

  return (
    <>
      <Box direction="row" wrap margin={margin}>
        {(groups || []).map(group => {
          const isSelected = group.sortKey === selectedGroup?.sortKey;
          return (
            <Tag
              key={group.sortKey}
              value={<Text color={isSelected ? 'brand' : undefined}>{group.title}</Text>}
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
