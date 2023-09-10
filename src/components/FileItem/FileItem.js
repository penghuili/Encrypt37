import { Box, Image, Layer, Menu, Spinner, Text } from 'grommet';
import { MoreVertical } from 'grommet-icons';
import React, { useState } from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import { formatTime } from '../../shared/js/date';
import LoadingSkeleton from '../../shared/react-pure/LoadingSkeleton';
import { isImage } from '../../shared/react/file';
import { useInView } from '../../shared/react/hooks/useInView';
import SelectedGroups from '../SelectedGroups';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';

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
      {!!fileMeta?.createdAt && (
        <HorizontalCenter>
          <Text size="xsmall" margin={margin}>
            {formatTime(new Date(fileMeta.createdAt))}
          </Text>
          <Menu
            icon={<MoreVertical size="small" />}
            items={[
              {
                label: fileMeta?.groups?.length ? 'Update tags' : 'Add tag',
                onClick: () => onUpdateTag(fileMeta),
                margin: '0.25rem 0',
              },
              {
                label: 'Delete',
                onClick: () => onDelete({ itemId: fileId }),
                margin: '0.25rem 0',
                color: 'status-critical',
                disabled: isDeleting,
              },
            ]}
          />
        </HorizontalCenter>
      )}
      <Box>{renderContent()}</Box>
      {!!fileMeta?.groups?.length && <SelectedGroups selectedGroups={fileMeta.groups} />}
      {!!fileMeta?.note && <Text margin={margin}>{fileMeta.note}</Text>}
      {renderOriginalImage()}
    </Box>
  );
}

export default FileItem;
