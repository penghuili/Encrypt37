import { endOfMonth, startOfMonth } from 'date-fns';
import { Box, Button, Text } from 'grommet';
import React, { useState } from 'react';

import FileItem from '../../components/FileItem';
import GroupFilter from '../../components/GroupFilter';
import YearMonthPicker from '../../components/YearMonthPicker';
import { useXMargin } from '../../hooks/useXMargin';
import { group37Prefix } from '../../shared/js/apps';
import { formatDateWeek } from '../../shared/js/date';
import getUTCTimeNumber from '../../shared/js/getUTCTimeNumber';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import RouteLink from '../../shared/react/RouteLink';

function Files({
  files,
  hasMore,
  startKey,
  isLoading,
  isCreating,
  isDeleting,
  onFetch,
  onFetchGroups,
}) {
  const margin = useXMargin();
  const [selectedGroup, setSelectedGroup] = useState(undefined);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndtime] = useState(null);

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix.file37 });
    onFetch({ force: true });
  });

  return (
    <>
      <AppBar title="File37" isLoading={isLoading || isCreating || isDeleting} />
      <ContentWrapper padding="0">
        <HorizontalCenter margin={margin}>
          <RouteLink
            to={`/files/upload`}
            label="Upload files"
            color="status-ok"
            margin="0 1rem 1rem 0"
          />
          <RouteLink to={`/groups`} label="Manage tags" color="status-ok" margin="0 1rem 1rem 0" />
        </HorizontalCenter>

        <Divider />
        <Spacer />
        <GroupFilter
          selectedGroup={selectedGroup}
          onSelect={value => {
            setSelectedGroup(value);
            onFetch({ groupId: value?.sortKey, force: true, startTime, endTime });
          }}
        />
        <Box margin={margin}>
          <YearMonthPicker
            startDate={new Date('2023-07-01')}
            onChange={value => {
              if (value) {
                const date = `${value}-01`;
                const startTime = getUTCTimeNumber(startOfMonth(new Date(date)));
                const endTime = getUTCTimeNumber(endOfMonth(new Date(date)));
                setStartTime(startTime);
                setEndtime(endTime);
                onFetch({ groupId: selectedGroup?.sortKey, force: true, startTime, endTime });
              } else {
                setStartTime(null);
                setEndtime(null);
                onFetch({ groupId: selectedGroup?.sortKey, force: true });
              }
            }}
          />
        </Box>
        <Spacer />
        <Divider />
        <Spacer />

        {!!files?.length &&
          files.map(fileDate => (
            <Box key={fileDate.date} margin="0 0 3rem">
              <Text margin={margin}>{formatDateWeek(new Date(fileDate.date))}</Text>
              {fileDate.items.map(file => (
                <Box key={file.sortKey} margin="0 0 1rem">
                  <FileItem fileId={file.sortKey} fileMeta={file} />
                </Box>
              ))}
            </Box>
          ))}

        {hasMore && (
          <Button
            label="Load more"
            onClick={() =>
              onFetch({
                startKey,
                groupId: selectedGroup?.sortKey,
                force: true,
                startTime,
                endTime,
              })
            }
            disabled={isLoading}
            margin={margin}
          />
        )}

        {!files?.length && !isLoading && (
          <>
            <Text margin={margin}>No files.</Text>
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Files;
