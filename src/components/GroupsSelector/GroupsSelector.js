import { Box, Tag, Text } from 'grommet';
import React, { useMemo } from 'react';

import { group37Prefix } from '../../shared/js/apps';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';

function GroupsSelector({ selectedGroups, groups, onFetchGroups, onSelect, onNav }) {
  const selectedGroupsObj = useMemo(() => {
    return (selectedGroups || []).reduce((acc, groupId) => {
      acc[groupId] = groupId;
      return acc;
    }, {});
  }, [selectedGroups]);

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix.file37 });
  });

  return (
    <>
      <Text weight="bold">Select tags</Text>
      <Box direction="row" wrap>
        {(groups || []).map(group => {
          const obj = selectedGroupsObj[group.sortKey];
          const color = obj ? 'brand' : undefined;

          return (
            <Tag
              key={group.sortKey}
              value={<Text color={color}>{group.title}</Text>}
              onClick={
                obj
                  ? undefined
                  : () => {
                      onSelect([...selectedGroups, group.sortKey]);
                    }
              }
              onRemove={
                obj
                  ? () => {
                      onSelect(selectedGroups.filter(id => id !== group.sortKey));
                    }
                  : undefined
              }
              size="small"
              margin="0 1rem 1rem 0"
            />
          );
        })}
        <Tag value="+" onClick={() => onNav(`/groups/add`)} size="small" margin="0 1rem 1rem 0" />
      </Box>
    </>
  );
}

export default GroupsSelector;
