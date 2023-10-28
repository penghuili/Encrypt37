import { Camera } from 'grommet-icons';
import uniqBy from 'lodash.uniqby';
import React from 'react';
import styled from 'styled-components';
import Spacer from '../../shared/react-pure/Spacer';
import { FILI_SIZE_LIMIT } from '../../shared/react/file';

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;

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

function TextEditorMediaIcon({
  postId,
  itemId,
  nextItem,
  disabled,
  onChange,
  onAttachFilesToPost,
}) {
  async function handleFiles(event) {
    const selectedFiles = Array.from(event.target.files);
    const uniqFiles = uniqBy(selectedFiles, 'name');

    if (!uniqFiles.length) {
      return;
    }

    const allowedFiles = [];
    const largeFiles = [];
    uniqFiles.forEach(file => {
      if (file.size <= FILI_SIZE_LIMIT) {
        allowedFiles.push(file);
      } else {
        largeFiles.push(file);
      }
    });

    if (!allowedFiles.length) {
      return;
    }

    const newItems = [];
    const timestamp = Date.now();
    allowedFiles.forEach((file, fileIndex) => {
      newItems.push({
        type: 'file',
        id: `file_${timestamp + fileIndex}`,
        file,
        loading: !!postId,
      });
      if (fileIndex !== allowedFiles.length - 1 || nextItem?.type !== 'note') {
        newItems.push({
          type: 'note',
          id: `note_${timestamp + fileIndex}`,
          note: '',
          loading: !!postId,
        });
      }
    });

    onChange({ items: newItems, largeFiles });
    if (postId) {
      onAttachFilesToPost({
        postId,
        items: newItems,
        startItemId: itemId,
      });
    }
  }

  return (
    <>
      <InputWrapper disabled={disabled}>
        <Camera size="small" />
        {!disabled && (
          <Input
            type="file"
            multiple
            capture="environment"
            accept="image/*, video/*, audio/*"
            onChange={e => {
              handleFiles(e);
            }}
          />
        )}
      </InputWrapper>
      <Spacer />
    </>
  );
}

export default TextEditorMediaIcon;
