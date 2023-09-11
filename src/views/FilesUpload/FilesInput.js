import { Box, Image, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import React, { useState } from 'react';
import styled from 'styled-components';

import { uniqBy } from '../../shared/js/uniq';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import {
  FILI_SIZE_LIMIT,
  FILI_SIZE_LIMIT_IN_MB,
  getFileSizeString,
  isImage,
} from '../../shared/react/file';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  border: 1px dashed #ccc;
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

function FilesInput({ files, notes, onSelected, onRemove }) {
  const [largeFiles, setLargeFiles] = useState([]);

  return (
    <>
      <HorizontalCenter>
        <Wrapper>
          <Input
            type="file"
            id="file-upload"
            multiple
            onChange={e => {
              const selected = Array.from(e.target.files);

              const uniqFiles = uniqBy([...selected, ...files], 'name');
              const allowedFiles = [];
              const tooLargeFiles = [];
              uniqFiles.forEach(file => {
                if (file.size <= FILI_SIZE_LIMIT) {
                  allowedFiles.push(file);
                } else {
                  tooLargeFiles.push(file);
                }
              });

              onSelected(allowedFiles);
              setLargeFiles(tooLargeFiles);
            }}
          />
          <label htmlFor="file-upload">
            {files?.length
              ? `${files.length} ${files.length > 1 ? 'files' : 'file'} selected`
              : 'Choose files...'}
          </label>
        </Wrapper>
        {(!!files?.length || !!largeFiles.length) && (
          <Close
            onClick={() => {
              onSelected([]);
              setLargeFiles([]);
            }}
          />
        )}
      </HorizontalCenter>

      <Spacer />
      <Divider />
      <Spacer />

      {!!files?.length && (
        <>
          {files.map(file => (
            <Box key={file.name} width="100%" margin="0 0 1rem">
              <FileInfo file={file} onRemove={() => onRemove(file)} />
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
    </>
  );
}

export default FilesInput;
