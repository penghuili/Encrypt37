import { subDays } from 'date-fns';
import { Box, Text } from 'grommet';
import { Refresh } from 'grommet-icons';
import React, { useMemo, useState } from 'react';
import PostItem from '../../components/PostItem';
import ScrollToTop from '../../components/ScrollToTop';
import StorageLimistBanner from '../../components/StorageLimistBanner';
import { useXMargin } from '../../hooks/useXMargin';
import { globalState } from '../../lib/globalState';
import { hasMoreStorage } from '../../lib/storageLimit';
import { group37Prefix } from '../../shared/js/apps';
import { formatDate } from '../../shared/js/date';
import AnimatedList from '../../shared/react-pure/AnimatedList';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import FloatingButton from '../../shared/react-pure/FloatingButton';
import LoadMore from '../../shared/react-pure/LoadMore';
import AppBar from '../../shared/react/AppBar';
import GroupFilter from '../../shared/react/GroupFilter';
import { parseEndTime, parseStartTime } from '../../shared/react/GroupFilter/GroupFilter';
import RouteLink from '../../shared/react/RouteLink';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { getQueryParams, objectToQueryString } from '../../shared/react/routeHelpers';
import { groupSelectors } from '../../store/group/groupStore';

function Posts({
  posts,
  hasMore,
  startKey,
  settings,
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
  const canUpload = useMemo(() => hasMoreStorage(settings?.size), [settings?.size]);
  const hasHistory = useMemo(
    () => !!settings?.createdAt && new Date(settings.createdAt) < subDays(new Date(), 7),
    [settings?.createdAt]
  );

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
        title="Encrypt37"
        isLoading={
          isLoading || isCreatingPost || isCreatingFile || isDeletingPost || isDeletingFile
        }
      />
      <ContentWrapper padding="0">
        <StorageLimistBanner canUpload={canUpload} />

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
        {hasHistory && (
          <Box align="start" direction="row" margin={margin}>
            <RouteLink label="On this day" to={`/on-this-day`} margin="0 1rem 1rem 0" />
            {!isLoading && (
              <Refresh
                onClick={() =>
                  onFetch({
                    force: true,
                    groupId: selectedGroupId,
                    startTime: parseStartTime(startTime),
                    endTime: parseEndTime(endTime),
                  })
                }
              />
            )}
          </Box>
        )}

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
        {canUpload && (
          <FloatingButton
            onClick={() =>
              onNav(selectedGroupId ? `/posts/add?groupId=${selectedGroupId}` : `/posts/add`)
            }
          />
        )}
      </ContentWrapper>
    </>
  );
}

export default Posts;
