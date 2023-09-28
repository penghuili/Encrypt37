import { Anchor, Box, Button, Image, Layer, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { hasMoreStorage, STORAGE_LIMIT_IN_GB } from '../../lib/storageLimit';
import apps, { group37Prefix } from '../../shared/js/apps';
import { uniqBy } from '../../shared/js/uniq';
import DatePicker2 from '../../shared/react-pure/DatePicker2';
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
import GroupsSelector from '../../shared/react/GroupsSelector';
import TextEditor from '../../shared/react/TextEditor';
import { groupActions, groupSelectors } from '../../store/group/groupStore';

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;
  border: 1px dashed ${apps.file37.color};
  padding: 0.5rem;

  opacity: ${props => (props.disabled ? 0.3 : 1)};

  &:hover {
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  }
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
const InputLabel = styled.label`
  user-select: none;
  &:hover {
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  }
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

function FilesUpload({ postId, settings, isCreatingPost, isCreating, onCreatePost, onUpload }) {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState({});
  const [largeFiles, setLargeFiles] = useState([]);
  const [date, setDate] = useState(null);
  const [postNote, setPostNote] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const canUpload = useMemo(() => hasMoreStorage(settings?.size), [settings?.size]);

  function handleReset() {
    setFiles([]);
    setNotes({});
    setLargeFiles([]);
    setPostNote('');
    setSelectedGroupIds([]);
    setDate(null);
  }

  function handleClose() {
    setShowModal(false);
    handleReset();
  }

  function handleUpload(filesToUpload, notesToUpload, thePostId) {
    if (!filesToUpload?.length) {
      return;
    }

    if (!thePostId) {
      onCreatePost({
        date: date ? date.getTime() : null,
        note: postNote,
        groups: selectedGroupIds,
        reorder: true,
        onSucceeded: newPost => {
          handleUpload(filesToUpload, notesToUpload, newPost?.sortKey);
        },
      });

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
        <LoadingSkeletonOverlay visible={isCreating || isCreatingPost}>
          <InputWrapper disabled={!canUpload}>
            {canUpload && (
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

                  if (!date) {
                    setDate(new Date());
                  }

                  setFiles(allowedFiles);
                  setLargeFiles(tooLargeFiles);
                  setShowModal(true);
                }}
              />
            )}
            <InputLabel htmlFor="file-upload" disabled={!canUpload}>
              {files?.length
                ? `${files.length} ${files.length > 1 ? 'files' : 'file'} ${
                    showModal ? 'selected' : 'left'
                  }`
                : '+ Upload files'}
            </InputLabel>
          </InputWrapper>
        </LoadingSkeletonOverlay>

        {(!!files?.length || !!largeFiles.length) && !isCreating && !isCreatingPost && (
          <Button label="Clear" plain onClick={handleReset} margin="0 0 0 1rem" />
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

          {!postId && (
            <>
              <DatePicker2 date={date} onSelect={setDate} />
              <Spacer />
              <TextEditor text={postNote} onChange={setPostNote} />
              <Spacer />

              <GroupsSelector
                group37Prefix={group37Prefix.file37}
                groupSelectors={groupSelectors}
                groupActions={groupActions}
                selectedGroups={selectedGroupIds}
                onSelect={setSelectedGroupIds}
              />
              <Spacer />
              <Divider />
              <Spacer />
            </>
          )}

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
              disabled={!files?.length || isCreating || isCreatingPost}
              primary
            />
          </Box>
        </LayerContentWrapper>
      </Layer>
    );
  }

  return (
    <>
      <Box>
        {renderFilesInput()}
        {!canUpload && (
          <Text margin="1rem 0 0" color="status-warning">
            You have reached the storage limit of {STORAGE_LIMIT_IN_GB}GB. Please{' '}
            <Anchor href="https://encrypt37.com/contact/" target="_blank">
              contact
            </Anchor>{' '}
            me if you need more storage.
          </Text>
        )}
      </Box>
      {renderModal()}
    </>
  );
}

export default FilesUpload;
