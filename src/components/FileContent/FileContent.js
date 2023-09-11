import { Box, Image, Layer, Spinner, Text } from 'grommet';
import React, { useState } from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import { formatDateTime } from '../../shared/js/date';
import LoadingSkeleton from '../../shared/react-pure/LoadingSkeleton';
import { getFileSizeString, isImage } from '../../shared/react/file';
import { useInView } from '../../shared/react/hooks/useInView';

function FileContent({
  fileId,
  fileMeta,

  thumbnail,
  file,
  isDownloadingFile,
  onDownloadFile,
  onDownloadThumbnail,
}) {
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const margin = useXMargin();

  const ref = useInView(() => {
    if (isImage(fileMeta?.mimeType)) {
      onDownloadThumbnail({ fileId });
    }
  });

  function renderContent() {
    if (isImage(fileMeta?.mimeType)) {
      const width = window.innerWidth > 500 ? '500px' : `${window.innerWidth}px`;
      return thumbnail ? (
        <Image
          src={thumbnail.url}
          alt={fileMeta.fileName}
          width="100%"
          maxWidth="500px"
          onClick={() => {
            onDownloadFile({ fileId });
            setShowOriginalImage(true);
          }}
        />
      ) : (
        <LoadingSkeleton width={width} height={width} />
      );
    }

    return <Text margin={margin}>{fileMeta.fileName}</Text>;
  }

  function renderOriginalImage() {
    if (!isImage(fileMeta?.mimeType)) {
      return null;
    }

    return (
      showOriginalImage && (
        <Layer
          full
          modal={false}
          onClickOutside={() => setShowOriginalImage(false)}
          onEsc={() => setShowOriginalImage(false)}
        >
          {isDownloadingFile && (
            <Box align="center" justify="center" height="100%">
              <Spinner />
            </Box>
          )}
          {!!file && (
            <Image
              src={file.url}
              alt={fileMeta.fileName}
              height="100%"
              fit="contain"
              onClick={() => setShowOriginalImage(false)}
            />
          )}
        </Layer>
      )
    );
  }

  if (!fileMeta) {
    return null;
  }

  return (
    <Box ref={ref}>
      <Box>{renderContent()}</Box>
      {!!fileMeta.size && (
        <Text size="xsmall" margin={margin}>
          {getFileSizeString(fileMeta.size)}{' '}
          {!!fileMeta.lastModified && ` · ${formatDateTime(fileMeta.lastModified)}`}
        </Text>
      )}
      {renderOriginalImage()}
    </Box>
  );
}

export default FileContent;
