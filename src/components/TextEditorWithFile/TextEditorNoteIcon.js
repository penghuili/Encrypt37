import { Note } from 'grommet-icons';
import React from 'react';
import Spacer from '../../shared/react-pure/Spacer';

function TextEditorNoteIcon({ postId, item, nextItem, disabled, onCreateNote, onChange }) {
  if (item?.type !== 'file' || nextItem?.type === 'note') {
    return null;
  }

  return (
    <>
      <Note
        opacity={disabled ? '0.3' : '1'}
        onClick={() => {
          if (disabled) {
            return;
          }

          onChange({
            type: 'note',
            id: `note_${Date.now()}`,
            note: '',
            loading: !!postId,
          });
          if (postId) {
            onCreateNote({
              postId,
              startItemId: item.id,
              note: '',
              date: Date.now(),
              goBack: false,
            });
          }
        }}
        size="small"
      />
      <Spacer />
    </>
  );
}

export default TextEditorNoteIcon;
