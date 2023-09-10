import { Box, Image, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import React from 'react';
import styled from 'styled-components';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import { isImage } from '../../shared/react/file';

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
        <Close onClick={onRemove} />
      </HorizontalCenter>
    </Box>
  );
}

function FilesInput({ files, notes, onNotesChange, onSelected, onRemove }) {
  return (
    <>
      <Wrapper>
        <Input
          type="file"
          id="file-upload"
          multiple
          onChange={e => {
            onSelected(e.target.files);
          }}
        />
        <label htmlFor="file-upload">
          {files?.length
            ? `${files.length} ${files.length > 1 ? 'files' : 'file'} selected`
            : 'Choose files...'}
        </label>
      </Wrapper>

      {files?.length ? (
        <>
          {Array.from(files).map(file => (
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
      ) : null}
    </>
  );
}

export default FilesInput;
