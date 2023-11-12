import { Box, Image, Spinner, Text } from 'grommet';
import { Attachment, Download } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useXMargin } from '../../hooks/useXMargin';
import { apps } from '../../shared/js/apps';
import LoadingSkeleton from '../../shared/react-pure/LoadingSkeleton';
import { isIOS } from '../../shared/react/device';
import { isImage, isPdf, isVideo } from '../../shared/react/file';
import { useInView } from '../../shared/react/hooks/useInView';
import { supportedFileIcon, supportedFileTypes } from './fileTypes';
const DownloadWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0.5rem;
  padding: 0.25rem;

  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  padding: 0.25rem;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  border: ${({ border }) => (border ? `1px solid ${apps.file37.color}` : '0')};
`;

function FileContent({
  fileId,
  fileMeta,
  fileMetaInStore,
  thumbnail,
  editable,
  isDownloadingFile,
  isAccountValid,
  onFetch,
  onDownloadFile,
  onDownloadThumbnail,
}) {
  const margin = useXMargin();
  const [clickedDownload, setClickedDownload] = useState(false);
  const contentWidth = window.innerWidth > 600 ? `600px` : `100%`;

  const innerFileMeta = fileMeta || fileMetaInStore;
  const ref = useInView(
    () => {
      if (!fileMeta) {
        onFetch({ itemId: fileId });
      }
    },
    { alwaysObserve: true }
  );
  useEffect(() => {
    if (isImage(innerFileMeta?.mimeType) && isAccountValid) {
      onDownloadThumbnail({ fileId, fileMeta: innerFileMeta });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerFileMeta?.mimeType]);

  function renderLoadingSkeleton() {
    return <LoadingSkeleton width={contentWidth} height="400px" />;
  }

  function renderFileIcon() {
    if (!innerFileMeta?.mimeType) {
      return null;
    }

    if (isVideo(innerFileMeta.mimeType)) {
      return supportedFileIcon[supportedFileTypes.VIDEO];
    }

    if (isPdf(innerFileMeta.mimeType)) {
      return supportedFileIcon[supportedFileTypes.PDF];
    }

    return <Attachment size="small" color="brand" />;
  }

  function showDownload() {
    return (
      !isIOS() &&
      !!innerFileMeta &&
      !editable &&
      isAccountValid &&
      (!isImage(innerFileMeta?.mimeType) || !!thumbnail)
    );
  }

  function renderContent() {
    if (!innerFileMeta) {
      return null;
    }

    if (isImage(innerFileMeta.mimeType) && isAccountValid) {
      return thumbnail ? (
        <Image
          fit="contain"
          src={thumbnail.url}
          alt={innerFileMeta.fileName}
          width={contentWidth}
          height="auto"
          style={{ maxWidth: '600px' }}
        />
      ) : (
        renderLoadingSkeleton()
      );
    }

    return (
      <Box margin={margin}>
        <Box
          height={editable ? '5rem' : undefined}
          margin={editable ? '1rem 0' : '0.5rem 0'}
          pad="0 1.5rem 0 0"
          width={contentWidth}
        >
          <Box direction="row" align="center" gap="small">
            {renderFileIcon()}
            <Text margin={margin} wordBreak="break-word">
              {innerFileMeta.fileName}
            </Text>
          </Box>
          {isVideo(innerFileMeta.mimeType) && (
            <Text size="small" margin={margin}>
              * Video player comes soon
            </Text>
          )}
        </Box>
      </Box>
    );
  }

  const isDownloading = isDownloadingFile && clickedDownload;
  return (
    <Box ref={ref} style={{ position: 'relative', minHeight: '1rem' }}>
      {renderContent()}

      {showDownload() && (
        <DownloadWrapper border={!isDownloading}>
          {isDownloading ? (
            <Spinner size="small" />
          ) : (
            <Download
              size="small"
              color="brand"
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
