import { Box, Button } from 'grommet';
import { Edit, Trash } from 'grommet-icons';
import React, { useRef, useState } from 'react';
import FileContent from '../../components/FileContent';
import NoteContent from '../../components/NoteContent';
import TextEditorItem from '../../components/TextEditorWithFile/TextEditorItem';
import { useXMargin } from '../../hooks/useXMargin';
import { group37Prefix } from '../../shared/js/apps';
import Confirm from '../../shared/react-pure/Confirm';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import GroupsSelected from '../../shared/react/GroupsSelected';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { groupSelectors } from '../../store/group/groupStore';

function PostContentItem({ item, editable }) {
  return item.id.startsWith('file37') ? (
    <FileContent fileId={item.id} fileMeta={item.fileMeta} editable={editable} showDownloadIcon />
  ) : (
    <NoteContent note={item.note} editable={editable} />
  );
}

function PostDetails({
  postId,
  post,
  isLoading,
  isDeleting,
  isExpired,
  onFetch,
  onFetchGroups,
  onDelete,
  onUpdate,
  onNav,
}) {
  const margin = useXMargin();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const contentRef = useRef(null);

  useEffectOnce(() => {
    onFetch({ itemId: postId });
    onFetchGroups({ prefix: group37Prefix.file37 });
  });

  function renderContent() {
    if (post) {
      return (
        <Box ref={contentRef}>
          {!!post?.groups?.length && (
            <Box margin={margin}>
              <GroupsSelected selectedGroups={post.groups} groupSelectors={groupSelectors} />
            </Box>
          )}

          {!!post.note && (
            <Box pad={margin} width="100%">
              <TextEditorItem
                text={post.note}
                editable={false}
                onReadOnlyChecked={content => {
                  onUpdate({ itemId: postId, note: content, goBack: false });
                }}
              />
            </Box>
          )}

          {!!post.items?.length &&
            post.items.map(item => (
              <Box key={item.id} margin="0.5rem 0" width="100%">
                <PostContentItem item={item} editable={false} />
              </Box>
            ))}
        </Box>
      );
    }

    return null;
  }

  return (
    <>
      <AppBar title="Post" hasBack isLoading={isLoading || isDeleting} />
      <ContentWrapper padding="0">
        <HorizontalCenter margin={margin}>
          <Button
            size="small"
            icon={<Edit size="small" />}
            onClick={() => onNav(`/posts/${postId}/update`)}
            margin="0 1rem 0 0"
            disabled={isDeleting || isLoading || isExpired}
          />

          <Button
            size="small"
            icon={<Trash size="small" color="status-critical" />}
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting || isLoading}
          />
        </HorizontalCenter>
        <Spacer />
        <Divider />
        <Spacer />

        {renderContent()}

        <Spacer size="5rem" />

        <Confirm
          message="Are you sure you want to delete this post?"
          show={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => onDelete({ itemId: postId, goBack: true })}
        />
      </ContentWrapper>
    </>
  );
}

export default PostDetails;
