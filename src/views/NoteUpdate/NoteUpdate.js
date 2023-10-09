import { Box, Button, Spinner } from 'grommet';
import React, { useState } from 'react';

import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { useListener } from '../../shared/react/hooks/useListener';
import TextEditor from '../../shared/react/TextEditor';

function PostUpdate({ noteId, note, isLoading, isUpdating, onFetch, onUpdate }) {
  const [content, setContent] = useState('');
  useListener(note?.note, value => setContent(value || ''));

  useEffectOnce(() => {
    onFetch({ itemId: noteId });
  });

  function renderContent() {
    if (note) {
      return (
        <>
          <Box align="start">
            <TextEditor text={content} onChange={setContent} />

            <Spacer />
            <Button
              primary
              label="Update"
              onClick={() => onUpdate({ itemId: noteId, note: content, goBack: true })}
              disabled={isUpdating}
            />
          </Box>
        </>
      );
    }

    if (isLoading) {
      return <Spinner />;
    }

    return null;
  }

  return (
    <>
      <AppBar title="Update note" hasBack />
      <ContentWrapper>{renderContent()}</ContentWrapper>
    </>
  );
}

export default PostUpdate;
