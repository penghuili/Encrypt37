import { Box, Button, FileInput, Text } from 'grommet';
import React, { useState } from 'react';

import FileItem from '../../components/FileItem';
import { formatDateWeek, formatTime } from '../../shared/js/date';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { isImage } from '../../shared/react/file';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { toastTypes } from '../../shared/react/store/sharedReducer';

function Files({ files, hasMore, startKey, isLoading, isCreating, onFetch, onUpload, onToast }) {
  const [file, setFile] = useState(null);

  useEffectOnce(() => {
    onFetch();
  });

  return (
    <>
      <AppBar title="File37" isLoading={isLoading || isCreating} />
      <ContentWrapper>
        <Box margin="0 0 1rem">
          <Box id="file37-file-input">
            <FileInput
              multiple={false}
              onChange={async event => {
                const selected = event.target.files[0];
                if (!selected) {
                  return;
                }

                if (!isImage(selected.type)) {
                  onToast(`Please select an image.`, toastTypes.critical);
                } else {
                  setFile(selected);
                }
              }}
              disabled={isCreating}
            />
          </Box>
          <Button
            label="Upload"
            onClick={() => {
              onUpload({ file });
              setFile(null);
              const fileInputClearButton = document.querySelector('#file37-file-input button');
              if (fileInputClearButton) {
                fileInputClearButton.click();
              }
            }}
            disabled={!file || isCreating}
            margin="1rem 0 0"
          />
        </Box>
        <Divider />
        <Spacer />

        {!!files?.length &&
          files.map(fileDate => (
            <Box key={fileDate.date} margin="0 0 3rem">
              <Text>{formatDateWeek(new Date(fileDate.date))}</Text>
              {fileDate.items.map(file => (
                <Box key={file.sortKey} margin="0 0 1rem">
                  <Text size="xsmall">{formatTime(new Date(file.createdAt))}</Text>
                  <FileItem fileId={file.sortKey} />
                </Box>
              ))}
            </Box>
          ))}

        {hasMore && (
          <Button label="Load more" onClick={() => onFetch({ startKey })} disabled={isLoading} />
        )}

        {!files?.length && !isLoading && (
          <>
            <Text margin="0 0 1rem">No files.</Text>
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Files;
