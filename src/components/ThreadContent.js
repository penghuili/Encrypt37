import React from 'react';

import FileContent from './FileContent';
import NoteContent from './NoteContent';

function ThreadContent({ item, editable }) {
  return item.id.startsWith('file37') ? (
    <FileContent fileId={item.id} editable={editable} />
  ) : (
    <NoteContent note={item.note} editable={editable} />
  );
}

export default ThreadContent;
