import { Box, Menu, Spinner, Text } from 'grommet';
import { MoreVertical } from 'grommet-icons';
import React, { useState } from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import { formatTime } from '../../shared/js/date';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import FileContent from '../FileContent';
import SelectedGroups from '../SelectedGroups';

function FileItem({
  fileId,
  fileMeta,
  isDownloadingFile,
  isDeleting,
  onDownloadFile,
  onDelete,
  onNav,
}) {
  const [isFocusing, setIsFocusing] = useState(false);
  const margin = useXMargin();

  if (!fileMeta) {
    return null;
  }

  return (
    <Box>
      <HorizontalCenter>
        <Text size="xsmall" margin={margin}>
          {formatTime(new Date(fileMeta.createdAt))}
        </Text>
        <Menu
          icon={<MoreVertical size="small" />}
          items={[
            {
              label: 'Update',
              onClick: () => onNav(`/files/${fileId}/update`),
              margin: '0.25rem 0',
            },
            {
              label: 'Download',
              onClick: () => {
                setIsFocusing(true);
                onDownloadFile({
                  fileId,
                  onSucceeded: fileUrl => {
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = fileMeta.fileName;
                    link.click();
                    setIsFocusing(false);
                  },
                });
              },
              margin: '0.25rem 0',
            },
            {
              label: 'Delete',
              onClick: () => {
                setIsFocusing(true);
                onDelete({ itemId: fileId, onSucceeded: () => setIsFocusing(false) });
              },
              margin: '0.25rem 0',
              color: 'status-critical',
              disabled: isDeleting,
            },
          ]}
        />
        {(isDeleting || isDownloadingFile) && !!isFocusing && <Spinner size="small" />}
      </HorizontalCenter>
      <FileContent fileId={fileId} fileMeta={fileMeta} />
      {!!fileMeta?.groups?.length && <SelectedGroups selectedGroups={fileMeta.groups} />}
      {!!fileMeta?.note && <Text margin={margin}>{fileMeta.note}</Text>}
    </Box>
  );
}

export default FileItem;
