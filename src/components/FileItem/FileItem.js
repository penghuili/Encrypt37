import { Anchor, Box, Image, Layer, Spinner, Text } from 'grommet';
import React, { useState } from 'react';

import LoadingSkeleton from '../../shared/react-pure/LoadingSkeleton';
import { isImage } from '../../shared/react/file';
import { useInView } from '../../shared/react/hooks/useInView';
import { useXMargin } from '../../hooks/useXMargin';

function FileItem({
  fileId,
  fileMeta,
  thumbnail,
  file,
  isDownloadingFile,
  isDownloadingThumbnail,
  isDeleting,
  onDownloadFile,
  onDownloadThumbnail,
  onDelete,
  onUpdateTag,
}) {
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const margin = useXMargin();

  const ref = useInView(() => {
    if (isImage(fileMeta?.mimeType)) {
      onDownloadThumbnail({ fileId });
    }
  });

  function renderActions() {
    return (
      <Box direction="row" margin={margin}>
        <Anchor
          label={fileMeta?.groups?.length ? 'Update tags' : 'Add tag'}
          onClick={() => {
            onUpdateTag(fileMeta);
          }}
          disabled={isDeleting}
          size="small"
          margin="0 1rem 0 0"
        />
        <Anchor
          label="Delete"
          onClick={() => {
            onDelete({ itemId: fileId });
          }}
          disabled={isDeleting}
          size="small"
          color="status-critical"
        />
      </Box>
    );
  }

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

  if (isDownloadingThumbnail && !fileMeta && !thumbnail) {
    return <Spinner />;
  }

  if (!fileMeta) {
    return <Text>File is not found.</Text>;
  }

  return (
    <Box ref={ref}>
      <Box>{renderContent()}</Box>
      {renderActions()}
      {renderOriginalImage()}
    </Box>
  );
}

export default FileItem;
