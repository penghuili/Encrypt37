import { Box, Button, Text } from 'grommet';
import React, { useEffect, useState } from 'react';

import FilesUpload from '../../components/FilesUpload';
import PostItem from '../../components/PostItem';
import { useXMargin } from '../../hooks/useXMargin';
import { group37Prefix } from '../../shared/js/apps';
import { formatDate } from '../../shared/js/date';
import AnimatedList from '../../shared/react-pure/AnimatedList';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import GroupFilter from '../../shared/react/GroupFilter';
import { parseEndTime, parseStartTime } from '../../shared/react/GroupFilter/GroupFilter';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { getQueryParams, objectToQueryString } from '../../shared/react/routeHelpers';
import { groupSelectors } from '../../store/group/groupStore';

function Posts({
  posts,
  hasMore,
  startKey,
  isLoading,
  isCreatingPost,
  isCreatingFile,
  isDeletingPost,
  isDeletingFile,
  onFetch,
  onFetchGroups,
  onNav,
}) {
  const margin = useXMargin();
  const [selectedGroupId, setSelectedGroupId] = useState(undefined);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const queryParams = getQueryParams();

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix.file37 });
  });

  useEffect(() => {
    onFetch({
      force: true,
      groupId: queryParams.groupId,
      startTime: parseStartTime(queryParams.startTime),
      endTime: parseEndTime(queryParams.endTime),
    });

    setSelectedGroupId(queryParams.groupId);
    setStartTime(queryParams.startTime);
    setEndTime(queryParams.endTime);
  }, [onFetch, queryParams.groupId, queryParams.startTime, queryParams.endTime]);

  function navigate(newGroupId, newStartTime, newEndTime) {
    const queryString =
      objectToQueryString({
        groupId: newGroupId,
        startTime: newStartTime,
        endTime: newEndTime,
      }) || Date.now();

    onNav(`/?${queryString}`);
  }

  return (
    <>
      <AppBar
        title="File37"
        isLoading={
          isLoading || isCreatingPost || isCreatingFile || isDeletingPost || isDeletingFile
        }
      />
      <ContentWrapper padding="0">
        <HorizontalCenter margin={margin}>
          <FilesUpload />
        </HorizontalCenter>

        <Spacer />
        <Divider />
        <Spacer />

        <Box margin={margin}>
          <GroupFilter
            groupSelectors={groupSelectors}
            selectedGroupId={selectedGroupId}
            onSelectGroup={value => {
              setSelectedGroupId(value?.sortKey);
              navigate(value?.sortKey, startTime, endTime);
            }}
            startTime={startTime ? new Date(startTime) : null}
            endTime={endTime ? new Date(endTime) : null}
            onSelectDateRange={({ startDate, endDate }) => {
              if (startDate && endDate) {
                const newStartTime = formatDate(startDate);
                const newEndTime = formatDate(endDate);
                setStartTime(newStartTime);
                setEndTime(newEndTime);
                navigate(selectedGroupId, newStartTime, newEndTime);
              } else {
                setStartTime(null);
                setEndTime(null);
                navigate(selectedGroupId, null, null);
              }
            }}
          />
        </Box>

        {!!posts?.length && (
          <>
            <AnimatedList
              items={posts}
              renderItem={item => (
                <Box margin="0 0 1rem">
                  <PostItem item={item} />
                </Box>
              )}
            />
          </>
        )}

        {hasMore && (
          <Button
            label="Load more"
            onClick={() =>
              onFetch({
                startKey,
                groupId: selectedGroupId,
                force: true,
                startTime: parseStartTime(startTime),
                endTime: parseEndTime(endTime),
              })
            }
            disabled={isLoading}
            margin={margin}
            size="small"
          />
        )}

        {!posts?.length && !isLoading && (
          <>
            <Text margin={margin}>No posts.</Text>
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Posts;
