import { Box, Button, Image, Text } from 'grommet';
import React, { useState } from 'react';
import LoadingSkeletonOverlay from '../../shared/react-pure/LoadingSkeletonOverlay';
import { isImage } from '../../shared/react/file';
import { useListener } from '../../shared/react/hooks/useListener';
import FileContent from '../FileContent';
import TextEditorAttachmentIcon from './TextEditorAttachmentIcon';
import TextEditorDeleteIcon from './TextEditorDeleteIcon';
import TextEditorItem from './TextEditorItem';
import TextEditorNoteIcon from './TextEditorNoteIcon';
import TextEditorToolbar from './TextEditorToolbar';

const firstNoteId = `note_${Date.now()}`;

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
  const [innerItems, setInnerItems] = useState(defaultItems);
  const [notes] = useState({});
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

  const [currentEditor, setCurrentEditor] = useState(null);

  function handleCreate() {
    const newItems = innerItems
      .map(item => (item.type === 'note' ? { ...item, note: notes[item.id] } : item))
      .filter(item => {
        if (item.type === 'note') {
          return !isEmptyContent(item.note);
        }

        return true;
      });

    if (newItems.length) {
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
      {!!currentEditor && <TextEditorToolbar editor={currentEditor} />}

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
                    }}
                    onFocus={newEditor => {
                      setCurrentEditor(newEditor);
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
            </Box>
          </Box>
        );
      })}

      {children}

      {!!onCreate && (
        <Box align="end" margin="2rem 0 0">
          <Button label="Create" primary onClick={handleCreate} disabled={disabled} />
        </Box>
      )}
    </Box>
  );
}

export default TextEditorWithFile;
