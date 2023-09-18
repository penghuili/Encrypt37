import { Box, Spinner } from 'grommet';
import React from 'react';

import FileContent from '../../components/FileContent';
import FilesUpload from '../../components/FilesUpload';
import { useXMargin } from '../../hooks/useXMargin';
import { group37Prefix } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import GroupsSelected from '../../shared/react/GroupsSelected';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import RouteLink from '../../shared/react/RouteLink';
import TextEditor from '../../shared/react/TextEditor';
import { groupSelectors } from '../../store/group/groupStore';

function PostDetails({ postId, post, isLoading, onFetch, onFetchGroups }) {
  const margin = useXMargin();

  useEffectOnce(() => {
    onFetch({ itemId: postId });
    onFetchGroups({ prefix: group37Prefix.file37 });
  });

  function renderContent() {
    if (post) {
      return (
        <>
          {!!post?.groups?.length && (
            <Box margin={margin}>
              <GroupsSelected selectedGroups={post.groups} groupSelectors={groupSelectors} />
            </Box>
          )}

          {!!post.note && (
            <Box margin={margin}>
              <TextEditor text={post.note} editable={false} />
            </Box>
          )}

          {!!post.files?.length &&
            post.files.map(fileId => (
              <Box key={fileId} margin="0 0 3rem">
                <FileContent postId={postId} fileId={fileId} showNote showActions />
              </Box>
            ))}
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
      <ContentWrapper>
        <HorizontalCenter margin={margin}>
          <FilesUpload postId={postId} />
          <RouteLink label="Update post" to={`/posts/${postId}/update`} />
        </HorizontalCenter>
        <Spacer />
        <Divider />
        <Spacer />

        {renderContent()}
      </ContentWrapper>
    </>
  );
}

export default PostDetails;
