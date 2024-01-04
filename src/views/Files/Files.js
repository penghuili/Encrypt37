import { Box, Button, Text } from 'grommet';
import React, { useState } from 'react';
import FileContent from '../../components/FileContent';
import ScrollToTop from '../../components/ScrollToTop';
import { useXMargin } from '../../hooks/useXMargin';
import { globalState } from '../../lib/globalState';
import { formatDate, formatDateWeekTime } from '../../shared/js/date';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import DateRange from '../../shared/react-pure/DateRange';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { parseEndTime, parseStartTime } from '../../shared/react/GroupFilter/GroupFilter';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { getQueryParams, objectToQueryString } from '../../shared/react/routeHelpers';

function Files({ files, hasMore, startKey, isLoading, onFetch, onNav }) {
  const margin = useXMargin();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffectOnce(() => {
    const queryParams = getQueryParams();
    onFetch({
      force: true,
      startTime: parseStartTime(queryParams.startTime),
      endTime: parseEndTime(queryParams.endTime),
    });
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

  function navigateAndFetch(newStartTime, newEndTime) {
    const queryString =
      objectToQueryString({
        startTime: newStartTime,
        endTime: newEndTime,
      }) || Date.now();
    onNav(`/files?${queryString}`);

    onFetch({
      force: true,
      startTime: parseStartTime(newStartTime),
      endTime: parseEndTime(newEndTime),
    });
  }

  return (
    <>
      <AppBar hasBack title="Files" isLoading={isLoading} />
      <ContentWrapper padding="0">
        <Box margin={margin}>
          <DateRange
            label="Filter by date"
            startDate={startTime ? new Date(startTime) : null}
            endDate={endTime ? new Date(endTime) : null}
            startLimit={new Date('2023-01-01')}
            endLimit={new Date()}
            onSelect={({ startDate, endDate }) => {
              if (startDate && endDate) {
                const newStartTime = formatDate(startDate);
                const newEndTime = formatDate(endDate);
                setStartTime(newStartTime);
                setEndTime(newEndTime);
                navigateAndFetch(newStartTime, newEndTime);
              } else {
                setStartTime(null);
                setEndTime(null);
                navigateAndFetch(null, null);
              }
            }}
          />
        </Box>
        <Spacer />
        <Divider />
        <Spacer />

        {!!files?.length && (
          <Box margin="0 0 3rem">
            {files.map(file => (
              <Box key={file.sortKey} margin="0 0 1rem">
                <Text size="xsmall" margin={margin}>
                  {formatDateWeekTime(new Date(file.createdAt))}
                </Text>
                <FileContent fileId={file.sortKey} fileMeta={file} editable={false} showDownloadIcon />
              </Box>
            ))}
          </Box>
        )}

        {hasMore && (
          <Button
            label="Load more"
            primary
            color="brand"
            onClick={() =>
              onFetch({
                startKey,
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

        <ScrollToTop />
      </ContentWrapper>
    </>
  );
}

export default Files;
