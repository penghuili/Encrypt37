import { Box, Button, Spinner } from 'grommet';
import React, { useState } from 'react';

import { useXMargin } from '../../hooks/useXMargin';
import { group37Prefix } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import GroupsUpdater from '../../shared/react/GroupsUpdater';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { useListener } from '../../shared/react/hooks/useListener';
import TextEditor from '../../shared/react/TextEditor';
import { groupActions, groupSelectors } from '../../store/group/groupStore';

function PostUpdate({ postId, post, isLoading, isUpdating, onFetch, onUpdate }) {
  const margin = useXMargin();

  const [postNote, setPostNote] = useState('');
  useListener(post?.note, value => setPostNote(value || ''));

  useEffectOnce(() => {
    onFetch({ itemId: postId });
  });

  function renderContent() {
    if (post) {
      return (
        <>
          {!!post.note && (
            <>
              <Box margin={margin} align="start">
                <TextEditor text={postNote} onChange={setPostNote} />

                <Spacer />
                <Button
                  primary
                  label="Update"
                  onClick={() => onUpdate({ itemId: postId, note: postNote })}
                  disabled={isUpdating}
                />
              </Box>
              <Spacer />
            </>
          )}

          <Spacer />
          <GroupsUpdater
            group37Prefix={group37Prefix.file37}
            groupSelectors={groupSelectors}
            groupActions={groupActions}
            item={post}
          />
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
      <AppBar title="Post" hasBack isLoading={isLoading} />
      <ContentWrapper>{renderContent()}</ContentWrapper>
    </>
  );
}

export default PostUpdate;
