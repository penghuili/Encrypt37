import { Box, Image, Layer, Spinner, Text } from 'grommet';
import React, { useEffect, useState } from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import LoadingSkeleton from '../../shared/react-pure/LoadingSkeleton';
import { isImage } from '../../shared/react/file';
import { useInView } from '../../shared/react/hooks/useInView';

function FileContent({
  fileId,
  fileMeta,
  thumbnail,
  rawFile,
  isDownloadingFile,
  onFetch,
  // onDownloadFile,
  onDownloadThumbnail,
}) {
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const margin = useXMargin();

  const ref = useInView(() => {
    onFetch({ itemId: fileId });
  });
  useEffect(() => {
    if (isImage(fileMeta?.mimeType)) {
      onDownloadThumbnail({ fileId, fileMeta });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileMeta?.mimeType]);

  function renderLoadingSkeleton() {
    const width = window.innerWidth > 600 ? `600px` : `100%`;
    return <LoadingSkeleton width={width} height="400px" />;
  }

  function renderContent() {
    if (!fileMeta) {
      return null;
    }

    if (isImage(fileMeta.mimeType)) {
      return thumbnail ? (
        <Image
          fit="contain"
          src={thumbnail.url}
          alt={fileMeta.fileName}
          width="100%"
          height="auto"
          style={{ maxWidth: '600px' }}
          onClick={() => {
            // onDownloadFile({ fileId });
            // TODO: fix this
            setShowOriginalImage(false);
          }}
        />
      ) : (
        renderLoadingSkeleton()
      );
    }

    return <Text margin={margin} wordBreak="break-word">{fileMeta.fileName}</Text>;
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
          {!!rawFile && (
            <Image
              src={rawFile.url}
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

  return (
    <Box ref={ref} align="center">
      {renderContent()}
      {renderOriginalImage()}
    </Box>
  );
}

export default FileContent;
