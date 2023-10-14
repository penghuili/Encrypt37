import { differenceInCalendarYears, subDays, subMonths, subYears } from 'date-fns';
import { Box, Tab, Tabs, Text } from 'grommet';
import React, { useMemo, useState } from 'react';
import PostItem from '../../components/PostItem';
import ScrollToTop from '../../components/ScrollToTop';
import { useXMargin } from '../../hooks/useXMargin';
import { globalState } from '../../lib/globalState';
import { group37Prefix } from '../../shared/js/apps';
import { formatDate, formatDateWeek } from '../../shared/js/date';
import AnimatedList from '../../shared/react-pure/AnimatedList';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import LoadMore from '../../shared/react-pure/LoadMore';
import AppBar from '../../shared/react/AppBar';
import { parseEndTime, parseStartTime } from '../../shared/react/GroupFilter/GroupFilter';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';

function getHistoryDays(startDate) {
  const history = [];

  const today = new Date();
  const lastWeek = subDays(today, 7);
  if (lastWeek > startDate) {
    history.push({ label: 'Last week', date: lastWeek });
  }

  const lastMonth = subMonths(today, 1);
  if (lastMonth > startDate) {
    history.push({ label: 'Last month', date: lastMonth });
  }

  const yearsCount = differenceInCalendarYears(today, startDate);
  if (yearsCount > 0) {
    Array(yearsCount)
      .fill(today.getFullYear())
      .forEach((_, index) => {
        const year = subYears(today, index + 1);
        if (year > startDate) {
          history.push({ label: year.getFullYear(), date: year });
        }
      });
  }

  return history;
}

function OnThisDay({
  posts,
  hasMore,
  startKey,
  settings,
  isLoading,
  isDeletingPost,
  onFetch,
  onFetchGroups,
  onNav,
}) {
  const margin = useXMargin();
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const historyDays = useMemo(() => {
    if (!settings?.createdAt) {
      return [];
    }

    return getHistoryDays(settings.createdAt);
  }, [settings?.createdAt]);

  useEffectOnce(() => {
    onFetchGroups({ prefix: group37Prefix.file37 });

    handleNewTab(0);

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

  function handleNewTab(tabIndex) {
    setActiveTabIndex(tabIndex);

    const day = historyDays[tabIndex];

    if (!day) {
      return;
    }

    onFetch({
      force: true,
      startTime: parseStartTime(day.date),
      endTime: parseEndTime(day.date),
    });
    setSelectedDate(day.date);
  }

  return (
    <>
      <AppBar
        title="On this day"
        isLoading={isLoading || isDeletingPost}
        hasBack
        onCustomBack={
          selectedDate
            ? () =>
                onNav(`/?startTime=${formatDate(selectedDate)}&endTime=${formatDate(selectedDate)}`)
            : undefined
        }
      />
      <ContentWrapper padding="0">
        {historyDays.length > 0 && (
          <Box margin="0 0 2rem">
            <Tabs activeIndex={activeTabIndex} onActive={handleNewTab}>
              {historyDays.map(({ label }) => (
                <Tab title={label} key={label} />
              ))}
            </Tabs>
            {!!selectedDate && (
              <Box margin={margin}>
                <Text margin="0.5rem 0 0">{formatDateWeek(selectedDate)}</Text>
              </Box>
            )}
          </Box>
        )}

        {!!posts?.length && !isLoading && (
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
              startTime: parseStartTime(selectedDate),
              endTime: parseEndTime(selectedDate),
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

export default OnThisDay;
