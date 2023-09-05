import { Box, Button, Text } from 'grommet';
import React, { useEffect, useState } from 'react';

import FileItem from '../../components/FileItem';
import GroupFilter from '../../components/GroupFilter';
import GroupsModal from '../../components/GroupsModal';
import SelectedGroups from '../../components/SelectedGroups';
import { useXMargin } from '../../hooks/useXMargin';
import { group37Prefix } from '../../shared/js/apps';
import { formatDateWeek, formatTime } from '../../shared/js/date';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import RouteLink from '../../shared/react/RouteLink';

function Files({ files, hasMore, startKey, isLoading, isCreating, onFetch, onFetchGroups }) {
  const margin = useXMargin();
  const [focusedFile, setFocusedFile] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(undefined);

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix.file37 });
  });
  useEffect(() => {
    onFetch({ groupId: selectedGroup?.sortKey, force: selectedGroup === null });
  }, [selectedGroup, onFetch]);

  return (
    <>
      <AppBar title="File37" isLoading={isLoading || isCreating} />
      <ContentWrapper padding="0">
        <HorizontalCenter margin={margin}>
          <RouteLink
            to={`/files/upload`}
            label="Upload files"
            color="status-ok"
            margin="0 1rem 1rem 0"
          />
        </HorizontalCenter>

        <Divider />
        <Spacer />
        <GroupFilter selectedGroup={selectedGroup} onSelect={setSelectedGroup} />

        {!!files?.length &&
          files.map(fileDate => (
            <Box key={fileDate.date} margin="0 0 3rem">
              <Text margin={margin}>{formatDateWeek(new Date(fileDate.date))}</Text>
              {fileDate.items.map(file => (
                <Box key={file.sortKey} margin="0 0 1rem">
                  <Text size="xsmall" margin={margin}>
                    {formatTime(new Date(file.createdAt))}
                  </Text>
                  <FileItem fileId={file.sortKey} onUpdateTag={setFocusedFile} />
                  <SelectedGroups selectedGroups={file.groups} />
                </Box>
              ))}
            </Box>
          ))}

        {hasMore && (
          <Button
            label="Load more"
            onClick={() => onFetch({ startKey })}
            disabled={isLoading}
            margin={margin}
          />
        )}

        {!files?.length && !isLoading && (
          <>
            <Text margin={margin}>No files.</Text>
          </>
        )}

        {!!focusedFile && (
          <GroupsModal fileId={focusedFile.sortKey} onClose={() => setFocusedFile(null)} />
        )}
      </ContentWrapper>
    </>
  );
}

export default Files;
