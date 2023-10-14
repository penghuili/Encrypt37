import { Spinner } from 'grommet';
import React, { useMemo } from 'react';
import TextEditorWithFile from '../../components/TextEditorWithFile';
import { group37Prefix } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import GroupsUpdater from '../../shared/react/GroupsUpdater';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { groupActions, groupSelectors } from '../../store/group/groupStore';

function PostUpdate({ postId, post, isLoading, onFetch }) {
  const filesIds = useMemo(() => {
    return (post?.files || []).join('-');
  }, [post?.files]);

  const items = useMemo(() => {
    if (post) {
      const first = {
        type: 'note',
        id: post.sortKey,
        note: post.note,
        decryptedPassword: post.decryptedPassword,
      };
      const rest = (post.items || []).map(item => ({
        ...item,
        note: item.type === 'note' ? item.note?.note : undefined,
      }));

      return [first, ...rest];
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.note, filesIds]);

  useEffectOnce(() => {
    onFetch({ itemId: postId });
  });

  function renderEditor() {
    if (post) {
      return <TextEditorWithFile postId={postId} items={items} />;
    }

    if (isLoading) {
      return <Spinner />;
    }

    return null;
  }

  function renderContent() {
    if (post) {
      return (
        <>
          {renderEditor()}

          <Spacer size="2rem" />

          <GroupsUpdater
            group37Prefix={group37Prefix.file37}
            groupSelectors={groupSelectors}
            groupActions={groupActions}
            item={post}
            alwaysShow={false}
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
      <AppBar title="Update post" hasBack />
      <ContentWrapper>{renderContent()}</ContentWrapper>
    </>
  );
}

export default PostUpdate;
