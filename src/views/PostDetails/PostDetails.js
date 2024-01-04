import { Box, Button } from 'grommet';
import { Edit, Trash } from 'grommet-icons';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useRef, useState } from 'react';
import { PiFilePdf } from 'react-icons/pi';
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
import { hexToRgb } from '../../shared/react-pure/color';
import { useBackgroundColor } from '../../shared/react-pure/createTheme';
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
  const backgroundColor = useBackgroundColor();

  useEffectOnce(() => {
    onFetch({ itemId: postId });
    onFetchGroups({ prefix: group37Prefix.file37 });
  });

  async function downloadPdf() {
    if (!contentRef.current) {
      return;
    }

    const canvas = await html2canvas(contentRef.current, { backgroundColor });
    const imgData = canvas.toDataURL('image/png');

    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfWidth = 210;
    const pdfHeight = pdfWidth / canvasAspectRatio;
    const padding = 8; // 10mm padding on all sides
    const imgWidth = pdfWidth - 2 * padding;
    const imgHeight = pdfHeight - 2 * padding;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    const bgColor = hexToRgb(backgroundColor); // Replace with your hex color
    pdf.setFillColor(...bgColor);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    pdf.addImage(imgData, 'PNG', padding, padding, imgWidth, imgHeight);

    pdf.save(`${Date.now()}.pdf`);
  }

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
            icon={<PiFilePdf />}
            onClick={downloadPdf}
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
