import { Box, Layer, Tag, Text } from 'grommet';
import { Close } from 'grommet-icons';
import React, { useMemo } from 'react';

import { group37Prefix } from '../../shared/js/apps';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';

function GroupsModal({
  fileId,
  file,
  groups,
  getIsAddingGroupItem,
  getIsDeletingGroupItem,
  onFetchFile,
  onFetchGroups,
  onAdd,
  onDelete,
  onNav,
  onClose,
}) {
  const selectedGroupsObj = useMemo(() => {
    return (file?.groups || []).reduce((acc, groupId) => {
      acc[groupId.id] = groupId;
      return acc;
    }, {});
  }, [file]);

  useEffectOnce(() => {
    onFetchFile({ itemId: fileId });
    onFetchGroups({ prefix: group37Prefix.file37 });
  });

  return (
    <Layer modal onClickOutside={onClose} onEsc={onClose}>
      <Box direction="row" justify="end" pad="1rem">
        <Close onClick={onClose} />
      </Box>
      <Box direction="row" wrap pad="2rem 1rem">
        {(groups || []).map(group => {
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
              value={<Text color={getColor()}>{group.title}</Text>}
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
    </Layer>
  );
}

export default GroupsModal;
