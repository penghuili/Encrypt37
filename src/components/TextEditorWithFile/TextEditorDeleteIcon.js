import { Trash } from 'grommet-icons';
import React, { useState } from 'react';

import Confirm from '../../shared/react-pure/Confirm';
import Spacer from '../../shared/react-pure/Spacer';

function TextEditorDeleteIcon({
  postId,
  index,
  item,
  previousItem,
  nextItem,
  notes,
  disabled,
  onDeleteNote,
  onDeleteFileAndCombineNotes,
  onChange,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (index === 0) {
    return null;
  }

  function handleDelete() {
    const removed = { [item.id]: item };
    const updated = {};
    if (previousItem?.type === 'note' && nextItem?.type === 'note') {
      removed[nextItem.id] = nextItem;
      const combinedNote = `${notes[previousItem.id] || ''}${notes[nextItem.id] || ''}`;

      updated[previousItem.id] = {
        ...previousItem,
        note: combinedNote,
      };
    }

    onChange({ removed, updated });

    if (postId) {
      if (item.type === 'note') {
        onDeleteNote({
          itemId: postId,
          noteId: item.id,
        });
      } else {
        onDeleteFileAndCombineNotes({
          postId,
          fileId: item.id,
          previousItem: updated[previousItem?.id],
          nextItem: removed[nextItem?.id],
        });
      }
    }
  }

  return (
    <>
      <Trash
        opacity={disabled ? '0.3' : '1'}
        onClick={() => {
          if (disabled) {
            return;
          }
          setShowDeleteConfirm(true);
        }}
        size="small"
      />
      <Spacer />

      <Confirm
        message="Are you sure you want to delete it?"
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default TextEditorDeleteIcon;
