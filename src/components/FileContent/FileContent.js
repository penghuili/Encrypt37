import { Box, Image, Layer, Menu, Spinner, Text } from 'grommet';
import React, { useEffect, useState } from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import { formatDateTime } from '../../shared/js/date';
import LoadingSkeleton from '../../shared/react-pure/LoadingSkeleton';
import { getFileSizeString, isImage } from '../../shared/react/file';
import { useInView } from '../../shared/react/hooks/useInView';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import { MoreVertical } from 'grommet-icons';

function FileContent({
  postId,
  fileId,
  fileMeta,
  showNote,
  showActions,

  thumbnail,
  rawFile,
  isDeleting,
  isLoadingFile,
  isDownloadingFile,
  onFetch,
  onDelete,
  onDownloadFile,
  onDownloadThumbnail,
  onNav,
}) {
  const [isFocusing, setIsFocusing] = useState(false);
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
    const width = window.innerWidth > 500 ? '500px' : `${window.innerWidth}px`;
    return <LoadingSkeleton width={width} height={width} />;
  }

  function renderContent() {
    if (isLoadingFile) {
      return renderLoadingSkeleton();
    }

    if (!fileMeta) {
      return null;
    }

    if (isImage(fileMeta?.mimeType)) {
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
        renderLoadingSkeleton()
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
    <Box ref={ref}>
      <Box>{renderContent()}</Box>
      {!!fileMeta?.size && (
        <HorizontalCenter>
          <Text size="xsmall" margin={margin}>
            {getFileSizeString(fileMeta.size)}{' '}
            {!!fileMeta.lastModified && ` · ${formatDateTime(fileMeta.lastModified)}`}
          </Text>
          {showActions && (
            <Menu
              icon={<MoreVertical size="small" />}
              items={[
                {
                  label: 'Update',
                  onClick: () => onNav(`/files/${fileMeta.sortKey}/update`),
                  margin: '0.25rem 0',
                },
                {
                  label: 'Delete',
                  onClick: () => {
                    setIsFocusing(true);
                    onDelete({ itemId: postId, fileId, onSucceeded: () => setIsFocusing(false) });
                  },
                  margin: '0.25rem 0',
                  color: 'status-critical',
                  disabled: isDeleting,
                },
              ]}
            />
          )}
          {isDeleting && !!isFocusing && <Spinner size="small" />}
        </HorizontalCenter>
      )}
      {!!fileMeta?.note && !!showNote && <Text margin={margin}>{fileMeta.note}</Text>}
      {renderOriginalImage()}
    </Box>
  );
}

export default FileContent;
