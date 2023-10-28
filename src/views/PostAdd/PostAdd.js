import { Text } from 'grommet';
import React, { useState } from 'react';
import styled from 'styled-components';
import TextEditorWithFile from '../../components/TextEditorWithFile';
import apps, { group37Prefix } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import DatePicker2 from '../../shared/react-pure/DatePicker2';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import GroupsSelector from '../../shared/react/GroupsSelector';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { getQueryParams } from '../../shared/react/routeHelpers';
import { groupActions, groupSelectors } from '../../store/group/groupStore';

const ProgressWrapper = styled.div`
  height: 8px;
  background-color: ${apps.file37.color};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: ${props => props.width};
  transition: width 0.5s;
`;

const ProgressArrow = styled.div`
  width: 8px;
  height: 8px;
  clip-path: polygon(100% 50%, 0 0, 0 100%);
  background-color: ${apps.file37.color};
  position: absolute;
  right: -8px;
  animation: moveArrow 1s infinite alternate;

  @keyframes moveArrow {
    0% {
      right: -8px;
    }
    100% {
      right: -2px;
    }
  }
`;

function Progress({ progress }) {
  const width = `${Math.floor(progress * 100)}%`;
  return (
    <ProgressWrapper width={width}>
      {/* <ProgressSpinner /> */}
      <ProgressArrow />
    </ProgressWrapper>
  );
}

function PostAdd({ isAttachingFiles, onAttachFilesToPost, onToast }) {
  const [date, setDate] = useState(new Date());
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffectOnce(() => {
    const queryParams = getQueryParams();
    if (queryParams.groupId) {
      setSelectedGroupIds([queryParams.groupId]);
    }
  });

  function handleSend(items) {
    let leftItems = items.slice(0);

    const filesCount = items.filter(i => i.type === 'file').length;
    onToast(
      `Encrypting and saving post ${
        filesCount > 0
          ? `(${filesCount} ${filesCount > 1 ? 'files' : 'file'}${
              filesCount > 4 ? ', it may take a while' : ''
            })`
          : ''
      }, please leave the page open ...`
    );
    onAttachFilesToPost({
      postId: null,
      items,
      startItemId: null,
      groups: selectedGroupIds,
      goBack: true,
      onUpdate: item => {
        leftItems = leftItems.filter(i => i.id !== item.id);
        setProgress(1 - leftItems.length / items.length);
      },
    });
  }

  const isPending = isAttachingFiles;
  return (
    <>
      <AppBar title="Add post" hasBack isLoading={isPending} />
      <ContentWrapper>
        {!!progress && <Progress progress={progress} />}

        <TextEditorWithFile
          isCreate
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
