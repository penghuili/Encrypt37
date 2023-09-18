import { Box, Button, Menu, Spinner, Text } from 'grommet';
import { MoreVertical } from 'grommet-icons';
import React, { useState } from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import { formatDateWeekTime } from '../../shared/js/date';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import GroupsSelected from '../../shared/react/GroupsSelected';
import { groupSelectors } from '../../store/group/groupStore';
import FileContent from '../FileContent';
import TextEditor from '../../shared/react/TextEditor';

function PostItem({ item, isDownloadingFile, isDeleting, onDelete, onNav }) {
  const [isFocusing, setIsFocusing] = useState(false);
  const margin = useXMargin();

  return (
    <Box>
      <HorizontalCenter>
        <Text size="xsmall" margin={margin}>
          {formatDateWeekTime(new Date(item.createdAt))}
        </Text>
        <Menu
          icon={<MoreVertical size="small" />}
          items={[
            {
              label: 'Update',
              onClick: () => onNav(`/posts/${item.sortKey}/update`),
              margin: '0.25rem 0',
            },
            {
              label: 'Delete',
              onClick: () => {
                setIsFocusing(true);
                onDelete({ itemId: item.sortKey, onSucceeded: () => setIsFocusing(false) });
              },
              margin: '0.25rem 0',
              color: 'status-critical',
              disabled: isDeleting,
            },
          ]}
        />
        {(isDeleting || isDownloadingFile) && !!isFocusing && <Spinner size="small" />}
      </HorizontalCenter>
      {!!item?.note && (
        <Box margin={margin}>
          <TextEditor text={item.note} editable={false} />
        </Box>
      )}
      {!!item?.files?.length && (
        <>
          <FileContent postId={item.sortKey} fileId={item.files[0]} />
          <Box margin={margin} align="start">
            <Button
              plain
              size="small"
              label={
                <Text size="small">
                  {item.files.length > 1
                    ? `View ${item.files.length - 1} more ${
                        item.files.length - 1 > 1 ? 'files' : 'file'
                      } >>`
                    : 'View >>'}
                </Text>
              }
              onClick={() => onNav(`/posts/${item.sortKey}`)}
            />
          </Box>
        </>
      )}
      {!!item?.groups?.length && (
        <Box margin={margin}>
          <GroupsSelected selectedGroups={item.groups} groupSelectors={groupSelectors} />
        </Box>
      )}
    </Box>
  );
}

export default PostItem;
