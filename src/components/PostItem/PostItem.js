import { Anchor, Box, Menu, Spinner, Text } from 'grommet';
import { MoreVertical } from 'grommet-icons';
import React, { useRef, useState } from 'react';
import { useXMargin } from '../../hooks/useXMargin';
import { setOffsetTop } from '../../lib/globalState';
import { formatDateWeekTime } from '../../shared/js/date';
import Confirm from '../../shared/react-pure/Confirm';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import ShowMoreWrapper from '../../shared/react-pure/ShowMoreWrapper';
import { breakpoint } from '../../shared/react-pure/size';
import GroupsSelected from '../../shared/react/GroupsSelected';
import TextEditor from '../../shared/react/TextEditor';
import useIsMobileSize from '../../shared/react/hooks/useIsMobileSize';
import { groupSelectors } from '../../store/group/groupStore';
import FileContent from '../FileContent';

function PostItem({ item, timeDiff, isDownloadingFile, isDeleting, onDelete, onUpdate, onNav }) {
  const margin = useXMargin();
  const isMobile = useIsMobileSize();
  const [isFocusing, setIsFocusing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const ref = useRef();

  function renderFiles() {
    const files = (item?.files || []).filter(fileId => fileId.startsWith('file37'));
    if (!files.length) {
      return null;
    }

    return <FileContent fileId={files[0]} editable={false} showDownloadIcon={false} />;
  }

  return (
    <Box ref={ref} width={isMobile ? '100vw' : '100%'} style={{ maxWidth: `${breakpoint}px` }}>
      <HorizontalCenter>
        <Text size="xsmall" margin={margin}>
          {formatDateWeekTime(new Date(item.createdAt))}
        </Text>
        <Menu
          icon={<MoreVertical size="small" />}
          items={[
            {
              label: 'Update',
              onClick: () => onNav(`/posts/${item.sortKey}/update`),
              margin: '0.25rem 0',
            },
            {
              label: 'Delete',
              onClick: () => {
                setShowDeleteConfirm(true);
              },
              margin: '0.25rem 0',
              color: 'status-critical',
              disabled: isDeleting,
            },
          ]}
        />
        {(isDeleting || isDownloadingFile) && !!isFocusing && <Spinner size="small" />}
      </HorizontalCenter>
      {!!timeDiff?.ago && (
        <Text size="xsmall" margin={margin}>
          {timeDiff.ago}
        </Text>
      )}
      {!!timeDiff?.gap && (
        <Text size="xsmall" margin={margin}>
          Since last time: {timeDiff.gap}
        </Text>
      )}

      {!!item?.note && (
        <Box margin={margin} pad="0.5rem 0 0">
          <ShowMoreWrapper showLink={false}>
            <TextEditor
              text={item.note}
              editable={false}
              onReadOnlyChecked={content => {
                onUpdate({ itemId: item.sortKey, note: content, goBack: false });
              }}
            />
          </ShowMoreWrapper>
        </Box>
      )}

      {renderFiles()}

      <Box margin={margin} align="start">
        <Anchor
          size="small"
          label={<Text size="small">Details &gt;&gt;</Text>}
          onClick={() => {
            onNav(`/posts/${item.sortKey}`);
            setOffsetTop(ref.current.offsetTop);
          }}
        />
      </Box>
      {!!item?.groups?.length && (
        <Box margin={margin}>
          <GroupsSelected selectedGroups={item.groups} groupSelectors={groupSelectors} />
        </Box>
      )}

      <Confirm
        message="Are you sure you want to delete this post?"
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setIsFocusing(true);
          onDelete({ itemId: item.sortKey, onSucceeded: () => setIsFocusing(false) });
        }}
      />
    </Box>
  );
}

export default PostItem;
