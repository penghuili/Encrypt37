import { Box, Text } from 'grommet';
import { Close } from 'grommet-icons';
import React from 'react';
import styled from 'styled-components';

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

function FilesInput({ files, onSelected, onRemove }) {
  return (
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
        {files?.length ? `${files.length} file(s) selected` : 'Choose files...'}
      </label>

      {files?.length ? (
        <>
          {Array.from(files).map(file => (
            <Box key={file.name} direction="row" align="center" margin="1rem 0 0">
              <Text truncate="tip" margin="0 1rem 0 0">{file.name}</Text>
              <Close onClick={() => onRemove(file)} />
            </Box>
          ))}
        </>
      ) : null}
    </Wrapper>
  );
}

export default FilesInput;
