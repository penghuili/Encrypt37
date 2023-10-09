import { Text } from 'grommet';
import React, { useState } from 'react';

import TextEditorWithFile from '../../components/TextEditorWithFile';
import { group37Prefix } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import DatePicker2 from '../../shared/react-pure/DatePicker2';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import GroupsSelector from '../../shared/react/GroupsSelector';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { getQueryParams } from '../../shared/react/routeHelpers';
import { groupActions, groupSelectors } from '../../store/group/groupStore';

function PostAdd({
  isCreatingPost,
  isCreatingNote,
  isCreatingFile,
  onCreatePost,
  onCreateNote,
  onCreateFile,
  onToast,
}) {
  const [date, setDate] = useState(new Date());
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);

  useEffectOnce(() => {
    const queryParams = getQueryParams();
    if (queryParams.groupId) {
      setSelectedGroupIds([queryParams.groupId]);
    }
  });

  function handleCreateNotesAndFiles(itemsToSend, postId) {
    if (!itemsToSend?.length) {
      onToast('Post is encrypted and saved in server.');
      return;
    }

    const firstItem = itemsToSend[0];
    if (firstItem.type === 'note') {
      onCreateNote({
        postId: postId,
        note: firstItem.note,
        date: Date.now(),
        goBack: itemsToSend.length === 1,
        onSucceeded: ({ post }) => {
          const left = itemsToSend.slice(1);
          handleCreateNotesAndFiles(left, post?.sortKey);
        
        },
      });
    } else {
      onCreateFile({
        postId: postId,
        file: firstItem.file,
        goBack: itemsToSend.length === 1,
        onSucceeded: ({ post }) => {
          const left = itemsToSend.slice(1);
          handleCreateNotesAndFiles(left, post?.sortKey);
        },
      });
    }
  }

  function handleSend(items) {
    onCreatePost({
      date: Date.now(),
      note: items[0].note,
      groups: selectedGroupIds,
      goBack: items.length === 1,
      onSucceeded: newPost => {
        handleCreateNotesAndFiles(items.slice(1), newPost?.sortKey);
      },
    });
  }

  return (
    <>
      <AppBar
        title="Add post"
        hasBack
        isLoading={isCreatingFile || isCreatingNote || isCreatingPost}
      />
      <ContentWrapper>
        <TextEditorWithFile
          disabled={isCreatingFile || isCreatingNote || isCreatingPost}
          onCreate={items => {
            handleSend(items);
          }}
        >
          <Spacer size="2rem" />
          <Text weight="bold">Select date:</Text>
          <DatePicker2 date={date} onSelect={setDate} />
          <Spacer />

          <GroupsSelector
            group37Prefix={group37Prefix.file37}
            groupSelectors={groupSelectors}
            groupActions={groupActions}
            selectedGroups={selectedGroupIds}
            onSelect={setSelectedGroupIds}
          />
          <Spacer size="2rem" />
          <Divider />
        </TextEditorWithFile>
      </ContentWrapper>
    </>
  );
}

export default PostAdd;
