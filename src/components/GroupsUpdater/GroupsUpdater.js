import { Box, Tag, Text } from 'grommet';
import React, { useMemo } from 'react';

import { noGroupSortKey } from '../../lib/constants';
import { group37Prefix } from '../../shared/js/apps';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';

function GroupsUpdater({
  file,
  groups,
  getIsAddingGroupItem,
  getIsDeletingGroupItem,
  onFetchGroups,
  onAdd,
  onDelete,
  onNav,
}) {
  const selectedGroupsObj = useMemo(() => {
    return (file?.groups || []).reduce((acc, groupId) => {
      acc[groupId.id] = groupId;
      return acc;
    }, {});
  }, [file]);

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix.file37 });
  });

  return (
    <Box direction="row" wrap>
      {(groups || []).map(group => {
        if (group.sortKey === noGroupSortKey) {
          return null;
        }

        const isAddingGroupItem = getIsAddingGroupItem(group.sortKey);
        const isDeletingGroupItem = getIsDeletingGroupItem(group.sortKey);
        const obj = selectedGroupsObj[group.sortKey];

        function getColor() {
          if (isAddingGroupItem || isDeletingGroupItem) {
            return 'status-disabled';
          }
          return obj ? 'brand' : undefined;
        }

        return (
          <Tag
            key={group.sortKey}
            value={
              <Text color={getColor()} size="small">
                {group.title}
              </Text>
            }
            onClick={
              obj
                ? undefined
                : () => {
                    if (isAddingGroupItem) {
                      return;
                    }
                    onAdd({
                      id: group.sortKey,
                      createdAt: file.createdAt,
                      sourceId: file.id,
                      sourceSortKey: file.sortKey,
                    });
                  }
            }
            onRemove={
              obj
                ? () => {
                    if (isDeletingGroupItem) {
                      return;
                    }
                    onDelete({
                      id: group.sortKey,
                      itemId: obj.itemId,
                    });
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
  );
}

export default GroupsUpdater;
