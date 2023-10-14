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

function PostAdd({ isAttachingFiles, onAttachFilesToPost, onToast }) {
  const [date, setDate] = useState(new Date());
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);

  useEffectOnce(() => {
    const queryParams = getQueryParams();
    if (queryParams.groupId) {
      setSelectedGroupIds([queryParams.groupId]);
    }
  });

  function handleSend(items) {
    onToast('Encrypting and saving post, please leave the page open ...');
    onAttachFilesToPost({
      postId: null,
      items,
      startItemId: null,
      groups: selectedGroupIds,
      goBack: true,
    });
  }

  const isPending = isAttachingFiles;
  return (
    <>
      <AppBar title="Add post" hasBack isLoading={isPending} />
      <ContentWrapper>
        <TextEditorWithFile
          disabled={isPending}
          onCreate={items => {
            handleSend(items);
          }}
        >
          <Spacer size="2rem" />
          <Text weight="bold">Select date</Text>
          <DatePicker2 date={date} onSelect={setDate} />
          <Spacer />

          <GroupsSelector
            group37Prefix={group37Prefix.file37}
            groupSelectors={groupSelectors}
            groupActions={groupActions}
            selectedGroups={selectedGroupIds}
            onSelect={setSelectedGroupIds}
            alwaysShow={false}
          />
          <Spacer size="2rem" />
          <Divider />
        </TextEditorWithFile>
      </ContentWrapper>
    </>
  );
}

export default PostAdd;
