import { Anchor, Box, Image, Layer, Spinner, Text } from 'grommet';
import React, { useEffect, useState } from 'react';

import { isImage } from '../../shared/react/file';

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
}) {
  const [showOriginalImage, setShowOriginalImage] = useState(false);

  useEffect(() => {
    if (!fileMeta) {
      return;
    }

    if (isImage(fileMeta?.mimeType)) {
      onDownloadThumbnail({ fileId });
    } else {
      onDownloadFile({ fileId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  function renderActions() {
    return (
      <>
        <Anchor
          label="Delete"
          onClick={() => {
            onDelete({ itemId: fileId });
          }}
          disabled={isDeleting}
          size="small"
          color="status-critical"
        />
      </>
    );
  }

  function renderContent() {
    if (isImage(fileMeta?.mimeType) && thumbnail) {
      return (
        <Image
          src={thumbnail.url}
          alt={fileMeta.fileName}
          width="300px"
          onClick={() => {
            onDownloadFile({ fileId });
            setShowOriginalImage(true);
          }}
        />
      );
    }

    return <Text>{fileMeta.fileName}</Text>;
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
              <Spinner size="xlarge" />
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
    <Box>
      {renderContent()}
      {renderActions()}
      {renderOriginalImage()}
    </Box>
  );
}

export default FileItem;
