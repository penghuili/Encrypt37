import { Box, Button, Image, Text } from 'grommet';
import React, { useState } from 'react';
import { LocalStorage } from '../../shared/js/LocalStorage';
import LoadingSkeletonOverlay from '../../shared/react-pure/LoadingSkeletonOverlay';
import { isImage } from '../../shared/react/file';
import useIsMobileSize from '../../shared/react/hooks/useIsMobileSize';
import { useListener } from '../../shared/react/hooks/useListener';
import FileContent from '../FileContent';
import TextEditorAttachmentIcon from './TextEditorAttachmentIcon';
import TextEditorDeleteIcon from './TextEditorDeleteIcon';
import TextEditorItem from './TextEditorItem';
import TextEditorMediaIcon from './TextEditorMediaIcon';
import TextEditorNoteIcon from './TextEditorNoteIcon';

const firstNoteId = `note_${Date.now()}`;
const storageKey = 'file37-post-add';

function isEmptyContent(content) {
  if (!content) {
    return true;
  }

  const div = document.createElement('div');
  div.innerHTML = content;
  return div.textContent.trim().length === 0;
}
const defaultItems = [
  {
    type: 'note',
    id: firstNoteId,
  },
];

function TextEditorWithFile({
  postId,
  items,
  disabled,
  isCreate,
  isCreatingNote,
  isUpdatingNote,
  isDeletingNote,
  isCreatingFile,
  isDeletingFile,
  isDeletingFileAndCombineNotes,
  isAttachingFiles,
  isUpdatingPost,
  children,
  onCreate,
  onCreateNote,
  onDeleteNote,
  onUpdateNote,
  onUpdatePost,
  onDeleteFileAndCombineNotes,
  onAttachFilesToPost,
}) {
  const isMobile = useIsMobileSize();
  const [innerItems, setInnerItems] = useState(defaultItems);
  const [notes] = useState({
    [firstNoteId]: isCreate ? LocalStorage.get(storageKey) || '' : '',
  });
  const [notesChanged, setNotesChanged] = useState(false);
  useListener(items, value => {
    setInnerItems(value || defaultItems);

    if (!notesChanged && value?.length) {
      value.forEach(item => {
        if (item.type === 'note' && item.note) {
          notes[item.id] = item.note;
        }
      });
      setNotesChanged(true);
    }
  });

  function handleCreate() {
    const newItems = innerItems
      .map(item => (item.type === 'note' ? { ...item, note: notes[item.id] } : item))
      .filter((item, index) => {
        // first item is post
        if (index !== 0 && item.type === 'note') {
          return !isEmptyContent(item.note);
        }

        return true;
      });

    if (newItems.length) {
      LocalStorage.remove(storageKey);
      onCreate(newItems);
    }
  }

  const isPending =
    isCreatingNote ||
    isUpdatingNote ||
    isDeletingNote ||
    isCreatingFile ||
    isDeletingFile ||
    isDeletingFileAndCombineNotes ||
    isAttachingFiles ||
    isUpdatingPost;

  return (
    <Box width="calc(100% - 2rem)">
      {innerItems.map((item, index) => {
        return (
          <Box key={item.id} direction="row" width="100%" style={{ position: 'relative' }}>
            <Box width="100%">
              {item.type === 'note' ? (
                <LoadingSkeletonOverlay visible={item.loading}>
                  <TextEditorItem
                    noteId={postId ? item.id : null}
                    text={notes[item.id]}
                    onChange={value => {
                      notes[item.id] = value;
                      if (index === 0 && isCreate) {
                        LocalStorage.set(storageKey, value);
                      }
                    }}
                    onUpdateNote={newNote => {
                      if (!postId) {
                        return;
                      }

                      if (item.id === postId) {
                        onUpdatePost({
                          itemId: item.id,
                          note: newNote,
                          goBack: false,
                        });
                      } else {
                        onUpdateNote({
                          itemId: item.id,
                          note: newNote,
                          goBack: false,
                        });
                      }
                    }}
                  />
                </LoadingSkeletonOverlay>
              ) : (
                <LoadingSkeletonOverlay visible={item.loading}>
                  {item.id.startsWith('file37') ? (
                    <FileContent fileId={item.id} fileMeta={item.fileMeta} editable />
                  ) : (
                    <Box>
                      {isImage(item.file.type) ? (
                        <Image
                          src={URL.createObjectURL(item.file)}
                          width="100%"
                          maxWidth="600px"
                          alt={item.file.name}
                        />
                      ) : (
                        <Box margin="1rem 0" height="5rem" justify="center" align="center">
                          <Text wordBreak="break-word">{item.file.name}</Text>
                        </Box>
                      )}
                    </Box>
                  )}
                </LoadingSkeletonOverlay>
              )}
            </Box>

            <Box width="2rem" style={{ position: 'absolute', right: '-3rem', top: '0.5rem' }}>
              {isMobile && (
                <TextEditorMediaIcon
                  postId={postId}
                  itemId={item.id}
                  nextItem={innerItems[index + 1]}
                  disabled={disabled || isPending}
                  onAttachFilesToPost={onAttachFilesToPost}
                  onChange={({ items: newItems }) => {
                    const updatedItems = innerItems
                      .slice(0, index + 1)
                      .concat(newItems)
                      .concat(innerItems.slice(index + 1));

                    setInnerItems(updatedItems);
                  }}
                />
              )}

              <TextEditorAttachmentIcon
                postId={postId}
                itemId={item.id}
                nextItem={innerItems[index + 1]}
                disabled={disabled || isPending}
                onAttachFilesToPost={onAttachFilesToPost}
                onChange={({ items: newItems }) => {
                  const updatedItems = innerItems
                    .slice(0, index + 1)
                    .concat(newItems)
                    .concat(innerItems.slice(index + 1));

                  setInnerItems(updatedItems);
                }}
              />

              <TextEditorNoteIcon
                postId={postId}
                item={item}
                nextItem={innerItems[index + 1]}
                disabled={disabled || isPending}
                onCreateNote={onCreateNote}
                onChange={newItem => {
                  const updatedItems = innerItems
                    .slice(0, index + 1)
                    .concat([newItem])
                    .concat(innerItems.slice(index + 1));

                  setInnerItems(updatedItems);
                }}
              />

              <TextEditorDeleteIcon
                postId={postId}
                index={index}
                item={item}
                previousItem={innerItems[index - 1]}
                nextItem={innerItems[index + 1]}
                notes={notes}
                disabled={disabled || isPending}
                onDeleteNote={onDeleteNote}
                onDeleteFileAndCombineNotes={onDeleteFileAndCombineNotes}
                onChange={({ removed, updated }) => {
                  const newItems = postId
                    ? innerItems.map((i, iIndex) => {
                        if (index === iIndex) {
                          return { ...i, loading: true };
                        }

                        if (removed[i.id]) {
                          return { ...i, loading: true };
                        }

                        if (updated[i.id]) {
                          if (innerItems[index - 1]) {
                            notes[innerItems[index - 1].id] = updated[i.id].note;
                          }
                          return { ...updated[i.id], loading: true };
                        }

                        return i;
                      })
                    : innerItems.filter(i => !removed[i.id]).map(i => updated[i.id] || i);

                  setInnerItems(newItems);
                }}
              />
            </Box>
          </Box>
        );
      })}

      {children}

      {!!onCreate && (
        <Box align="end" margin="2rem 0 0">
          <Button label="Create" primary color="brand" onClick={handleCreate} disabled={disabled} />
        </Box>
      )}
    </Box>
  );
}

export default TextEditorWithFile;
