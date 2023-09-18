import { Box, Button, Image, Layer, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import React, { useState } from 'react';
import styled from 'styled-components';

import apps from '../../shared/js/apps';
import { uniqBy } from '../../shared/js/uniq';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import LoadingSkeletonOverlay from '../../shared/react-pure/LoadingSkeletonOverlay';
import Spacer from '../../shared/react-pure/Spacer';
import {
  FILI_SIZE_LIMIT,
  FILI_SIZE_LIMIT_IN_MB,
  getFileSizeString,
  isImage,
} from '../../shared/react/file';

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;
  border: 1px dashed ${apps.file37.color};
  padding: 0.5rem;
  margin: 0 1rem 0 0;
`;
const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
`;

const LayerContentWrapper = styled.div`
  padding: 1rem 1rem 3rem;
  overflow-y: auto;
  max-width: 800px;
  width: 100vw;
  box-sizing: border-box;
  margin: 0 auto;
`;

function FileInfo({ file, onRemove }) {
  return (
    <Box>
      {isImage(file.type) && (
        <Image src={URL.createObjectURL(file)} width="200px" alt={file.name} />
      )}
      <HorizontalCenter>
        <Text truncate="tip" margin="0 1rem 0 0">
          {file.name}
        </Text>
        <Text margin="0 1rem 0 0">{getFileSizeString(file.size)}</Text>
        <Close onClick={onRemove} size="small" />
      </HorizontalCenter>
    </Box>
  );
}

function FilesUpload({ postId, isCreating, onUpload }) {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState({});
  const [largeFiles, setLargeFiles] = useState([]);

  function handleReset() {
    setFiles([]);
    setNotes({});
    setLargeFiles([]);
  }

  function handleClose() {
    setShowModal(false);
    handleReset();
  }

  function handleUpload(filesToUpload, notesToUpload, thePostId) {
    if (!filesToUpload?.length) {
      return;
    }

    const firstFile = filesToUpload[0];
    onUpload({
      postId: thePostId,
      file: firstFile,
      note: notesToUpload[firstFile.name],
      goBack: false,
      onSucceeded: ({ post }) => {
        const left = filesToUpload.slice(1);
        setFiles(left);
        handleUpload(left, notesToUpload, post?.sortKey);

        if (!left.length) {
          handleReset();
        }
      },
    });

    setShowModal(false);
  }

  function renderFilesInput() {
    return (
      <HorizontalCenter>
        <InputWrapper>
          <Input
            type="file"
            id="file-upload"
            multiple
            onChange={e => {
              const selected = Array.from(e.target.files);

              const uniqFiles = uniqBy([...selected, ...files], 'name');
              if (!uniqFiles.length) {
                return;
              }

              const allowedFiles = [];
              const tooLargeFiles = [];
              uniqFiles.forEach(file => {
                if (file.size <= FILI_SIZE_LIMIT) {
                  allowedFiles.push(file);
                } else {
                  tooLargeFiles.push(file);
                }
              });

              setFiles(allowedFiles);
              setLargeFiles(tooLargeFiles);
              setShowModal(true);
            }}
          />
          <label htmlFor="file-upload">
            {files?.length
              ? `${files.length} ${files.length > 1 ? 'files' : 'file'} ${
                  showModal ? 'selected' : 'left'
                }`
              : '+ Upload files'}
          </label>

          {isCreating && <LoadingSkeletonOverlay />}
        </InputWrapper>

        {(!!files?.length || !!largeFiles.length) && !isCreating && (
          <Button label="Clear" plain onClick={handleReset} />
        )}
      </HorizontalCenter>
    );
  }

  function renderModal() {
    if (!showModal) {
      return null;
    }

    return (
      <Layer onClickOutside={handleClose} onEsc={handleClose}>
        <LayerContentWrapper>
          {renderFilesInput()}

          <Spacer />
          <Divider />
          <Spacer />

          {!!files?.length && (
            <>
              {files.map(file => (
                <Box key={file.name} margin="0 0 1rem">
                  <FileInfo
                    file={file}
                    onRemove={() => setFiles(files.filter(f => f.name !== file.name))}
                  />
                  <TextArea
                    value={notes[file.name]}
                    onChange={e => {
                      notes[file.name] = e.target.value;
                    }}
                  />
                </Box>
              ))}
            </>
          )}

          {!!largeFiles?.length && (
            <>
              <Text color="status-critical" margin="2rem 0 0" weight="bold">
                File size limit is {FILI_SIZE_LIMIT_IN_MB}MB,{' '}
                {largeFiles.length > 1 ? 'these files are' : 'this file is'} too large:
              </Text>
              {largeFiles.map(file => (
                <Box key={file.name} margin="0 0 1rem">
                  <FileInfo
                    file={file}
                    onRemove={() => {
                      setLargeFiles(largeFiles.filter(f => f.name !== file.name));
                    }}
                  />
                </Box>
              ))}
            </>
          )}

          <Spacer />
          <Box direction="row" justify="between">
            <Button label="Cancel" onClick={handleClose} />
            <Button
              label="Upload"
              onClick={() => {
                handleUpload(files, notes, postId);
              }}
              disabled={!files?.length || isCreating}
              primary
            />
          </Box>
        </LayerContentWrapper>
      </Layer>
    );
  }

  return (
    <>
      {renderFilesInput()}
      {renderModal()}
    </>
  );
}

export default FilesUpload;
