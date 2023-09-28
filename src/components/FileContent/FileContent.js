import { Box, Button, Image, Layer, Spinner, Text } from 'grommet';
import { Download, Edit, Trash } from 'grommet-icons';
import React, { useEffect, useState } from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import Confirm from '../../shared/react-pure/Confirm';
import LoadingSkeleton from '../../shared/react-pure/LoadingSkeleton';
import LoadingSkeletonOverlay from '../../shared/react-pure/LoadingSkeletonOverlay';
import { getFileSizeString, isImage } from '../../shared/react/file';
import { useInView } from '../../shared/react/hooks/useInView';

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
  onToast,
}) {
  const [isFocusing, setIsFocusing] = useState(false);
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      {showActions && !!fileMeta?.size && (
        <>
          <Box gap="2rem" direction="row" justify="between" align="center">
            <Text size="xsmall" margin={margin}>
              {getFileSizeString(fileMeta.size)}
            </Text>

            <Button
              size="small"
              icon={<Edit size="small" />}
              onClick={() => onNav(`/files/${fileMeta.sortKey}/update`)}
            />
            <LoadingSkeletonOverlay visible={isDownloadingFile && isFocusing}>
              <Button
                size="small"
                icon={<Download size="small" />}
                onClick={() => {
                  setIsFocusing(true);
                  onDownloadFile({
                    fileId,
                    onSucceeded: () => {
                      setIsFocusing(false);
                      onToast('Downloaded.');
                    },
                  });
                }}
              />
            </LoadingSkeletonOverlay>
            <LoadingSkeletonOverlay visible={isDeleting && isFocusing}>
              <Button
                size="small"
                icon={<Trash size="small" />}
                onClick={() => {
                  setShowConfirm(true);
                }}
              />
            </LoadingSkeletonOverlay>
          </Box>
        </>
      )}
      {!!fileMeta?.note && !!showNote && <Text margin={margin}>{fileMeta.note}</Text>}
      {renderOriginalImage()}
      <Confirm
        message="Are you sure to delete this file?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setIsFocusing(true);
          onDelete({ itemId: postId, fileId, onSucceeded: () => setIsFocusing(false) });
        }}
      />
    </Box>
  );
}

export default FileContent;
