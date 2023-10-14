import { Box, Image, Spinner, Text } from 'grommet';
import { Download } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useXMargin } from '../../hooks/useXMargin';
import LoadingSkeleton from '../../shared/react-pure/LoadingSkeleton';
import { isImage } from '../../shared/react/file';
import { useInView } from '../../shared/react/hooks/useInView';

const DownloadWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0.5rem;
`;

function FileContent({
  fileId,
  fileMeta,
  fileMetaInStore,
  thumbnail,
  editable,
  isDownloadingFile,
  onFetch,
  onDownloadFile,
  onDownloadThumbnail,
}) {
  const margin = useXMargin();
  const [clickedDownload, setClickedDownload] = useState(false);

  const innerFileMeta = fileMeta || fileMetaInStore;
  const ref = useInView(() => {
    if (!fileMeta) {
      onFetch({ itemId: fileId });
    }
  });
  useEffect(() => {
    if (isImage(innerFileMeta?.mimeType)) {
      onDownloadThumbnail({ fileId, fileMeta: innerFileMeta });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerFileMeta?.mimeType]);

  function renderLoadingSkeleton() {
    const width = window.innerWidth > 600 ? `600px` : `100%`;
    return <LoadingSkeleton width={width} height="400px" />;
  }

  function renderContent() {
    if (!innerFileMeta) {
      return null;
    }

    if (isImage(innerFileMeta.mimeType)) {
      return thumbnail ? (
        <Image
          fit="contain"
          src={thumbnail.url}
          alt={innerFileMeta.fileName}
          width="100%"
          height="auto"
          style={{ maxWidth: '600px' }}
        />
      ) : (
        renderLoadingSkeleton()
      );
    }

    return (
      <Box height={editable ? '5rem' : undefined} margin={editable ? '1rem 0' : undefined}>
        <Text margin={margin} wordBreak="break-word">
          {innerFileMeta.fileName}
        </Text>
      </Box>
    );
  }

  return (
    <Box ref={ref} align="center" style={{ position: 'relative' }}>
      {renderContent()}
      {!editable && (
        <DownloadWrapper>
          {isDownloadingFile && clickedDownload ? (
            <Spinner size="small" />
          ) : (
            <Download
              size="small"
              color="status-ok"
              onClick={() => {
                setClickedDownload(true);
                onDownloadFile({
                  fileId,
                  onSucceeded: () => {
                    setClickedDownload(false);
                  },
                });
              }}
            />
          )}
        </DownloadWrapper>
      )}
    </Box>
  );
}

export default FileContent;
