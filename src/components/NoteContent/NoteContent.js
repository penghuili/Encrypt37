import { Box } from 'grommet';
import React from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import LoadingSkeleton from '../../shared/react-pure/LoadingSkeleton';
import { breakpoint } from '../../shared/react-pure/size';
import TextEditorItem from '../TextEditorWithFile/TextEditorItem';

function NoteContent({ editable, note, isLoading, onUpdate }) {
  const margin = useXMargin();
  
  function renderLoadingSkeleton() {
    const width = window.innerWidth > breakpoint ? `${breakpoint}px` : `${window.innerWidth}px`;
    return <LoadingSkeleton width={width} height="400px" />;
  }

  function renderContent() {
    if (isLoading) {
      return renderLoadingSkeleton();
    }

    if (!note) {
      return null;
    }

    return (
      <TextEditorItem
        editable={!!editable}
        text={note.note}
        onReadOnlyChecked={content => {
          onUpdate({ itemId: note.sortKey, note: content, goBack: false });
        }}
      />
    );
  }

  return (
    <Box margin={margin}>
      {renderContent()}
    </Box>
  );
}

export default NoteContent;
