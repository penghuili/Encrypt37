import { differenceInCalendarYears, subDays, subMonths, subYears } from 'date-fns';
import { Box, Tab, Tabs, Text } from 'grommet';
import React, { useMemo, useState } from 'react';
import PostItems from '../../components/PostItems';
import ScrollToTop from '../../components/ScrollToTop';
import { useXMargin } from '../../hooks/useXMargin';
import { globalState } from '../../lib/globalState';
import { group37Prefix } from '../../shared/js/apps';
import { formatDateWeek } from '../../shared/js/date';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import LoadMore from '../../shared/react-pure/LoadMore';
import AppBar from '../../shared/react/AppBar';
import { parseEndTime, parseStartTime } from '../../shared/react/GroupFilter/GroupFilter';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { getQueryParams } from '../../shared/react/routeHelpers';

function getHistoryDays(startDate) {
  const startDateObj = new Date(startDate);
  const history = [];

  const today = new Date();
  const lastWeek = subDays(today, 7);
  if (lastWeek > startDateObj) {
    history.push({ label: 'Last week', date: lastWeek });
  }

  const lastMonth = subMonths(today, 1);
  if (lastMonth > startDateObj) {
    history.push({ label: 'Last month', date: lastMonth });
  }

  const sixMonthsAgo = subMonths(today, 6);
  if (sixMonthsAgo > startDateObj) {
    history.push({ label: 'Half a year', date: sixMonthsAgo });
  }

  const yearsCount = differenceInCalendarYears(today, startDateObj);
  if (yearsCount > 0) {
    Array(yearsCount)
      .fill(today.getFullYear())
      .forEach((_, index) => {
        const year = subYears(today, index + 1);
        if (year > startDateObj) {
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

    const queryParams = getQueryParams();
    handleNewTab(queryParams.index !== undefined ? parseInt(queryParams.index) : 0);

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
    onNav(`/on-this-day/?index=${tabIndex}`);
  }

  return (
    <>
      <AppBar title="On this day" isLoading={isLoading || isDeletingPost} hasBack />
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

        <PostItems posts={posts} />

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
