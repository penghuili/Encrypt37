import { Box, Image, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import {
  FILI_SIZE_LIMIT,
  FILI_SIZE_LIMIT_IN_MB,
  getFileSizeString,
  isImage,
} from '../../shared/react/file';
import { uniqBy } from '../../shared/js/uniq';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  border: 1px dashed #ccc;
  padding: 0.5rem;
`;
const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  height: 100%;
  cursor: pointer;
`;

function FileInfo({ file, onRemove }) {
  return (
    <Box margin="1rem 0 0">
      {isImage(file.type) && (
        <Image src={URL.createObjectURL(file)} width="100px" height="100px" alt={file.name} />
      )}
      <HorizontalCenter>
        <Text truncate="tip" margin="0 1rem 0 0">
          {file.name}
        </Text>
        <Text margin="0 1rem 0 0">{getFileSizeString(file.size)}</Text>
        <Close onClick={onRemove} />
      </HorizontalCenter>
    </Box>
  );
}

function FilesInput({ files, notes, onNotesChange, onSelected, onRemove }) {
  const [largeFiles, setLargeFiles] = useState([]);

  return (
    <>
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

      {!!files?.length && (
        <>
          {files.map(file => (
            <Box key={file.name}>
              <FileInfo file={file} onRemove={() => onRemove(file)} />
              <TextArea
                note={notes[file.name]}
                onChange={e => {
                  onNotesChange({ ...notes, [file.name]: e.target.value });
                }}
              />
            </Box>
          ))}
        </>
      )}

      {!!largeFiles?.length && (
        <>
          <Text color="status-critical" margin="1rem 0 0" weight="bold">
            File size limit is {FILI_SIZE_LIMIT_IN_MB}MB,{' '}
            {largeFiles.length > 1 ? 'these files are' : 'this file is'} too large:
          </Text>
          {largeFiles.map(file => (
            <Box key={file.name}>
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
