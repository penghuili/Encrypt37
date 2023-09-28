import { Box, Text } from 'grommet';
import React, { useState } from 'react';

import FilesUpload from '../../components/FilesUpload';
import PostItem from '../../components/PostItem';
import ScrollToTop from '../../components/ScrollToTop';
import { useXMargin } from '../../hooks/useXMargin';
import { globalState } from '../../lib/globalState';
import { group37Prefix } from '../../shared/js/apps';
import { formatDate } from '../../shared/js/date';
import AnimatedList from '../../shared/react-pure/AnimatedList';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import LoadMore from '../../shared/react-pure/LoadMore';
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

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix.file37 });

    const queryParams = getQueryParams();
    onFetch({
      groupId: queryParams.groupId,
      startTime: parseStartTime(queryParams.startTime),
      endTime: parseEndTime(queryParams.endTime),
    });
    setSelectedGroupId(queryParams.groupId);
    setStartTime(queryParams.startTime);
    setEndTime(queryParams.endTime);

    if (globalState.offsetTop) {
      setTimeout(() => {
        window.scrollTo({
          top: globalState.offsetTop,
          behavior: 'smooth',
        });
        globalState.offsetTop = null;
      }, 500);
    }
  });

  function navigateAndFetch(newGroupId, newStartTime, newEndTime) {
    const queryString =
      objectToQueryString({
        groupId: newGroupId,
        startTime: newStartTime,
        endTime: newEndTime,
      }) || Date.now();
    onNav(`/?${queryString}`);

    onFetch({
      force: true,
      groupId: newGroupId,
      startTime: parseStartTime(newStartTime),
      endTime: parseEndTime(newEndTime),
    });
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
              navigateAndFetch(value?.sortKey, startTime, endTime);
            }}
            startTime={startTime ? new Date(startTime) : null}
            endTime={endTime ? new Date(endTime) : null}
            onSelectDateRange={({ startDate, endDate }) => {
              if (startDate && endDate) {
                const newStartTime = formatDate(startDate);
                const newEndTime = formatDate(endDate);
                setStartTime(newStartTime);
                setEndTime(newEndTime);
                navigateAndFetch(selectedGroupId, newStartTime, newEndTime);
              } else {
                setStartTime(null);
                setEndTime(null);
                navigateAndFetch(selectedGroupId, null, null);
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

        <LoadMore
          hasMore={hasMore}
          isLoading={isLoading}
          margin={margin}
          onLoadMore={() =>
            onFetch({
              force: true,
              startKey,
              groupId: selectedGroupId,
              startTime: parseStartTime(startTime),
              endTime: parseEndTime(endTime),
            })
          }
        />

        {!posts?.length && !isLoading && (
          <>
            <Text margin={margin}>No posts.</Text>
          </>
        )}

        <ScrollToTop />
      </ContentWrapper>
    </>
  );
}

export default Posts;
