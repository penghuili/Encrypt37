import React, { useEffect } from 'react';
import { Link } from '@tiptap/extension-link';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Typography } from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { breakpoint } from '../../shared/react-pure/size';
import useAutoSave from '../../shared/react/hooks/useAutoSave';
import useIsMobileSize from '../../shared/react/hooks/useIsMobileSize';
import useRefValue from '../../shared/react/hooks/useRefValue';
import TextEditorToolbar from './TextEditorToolbar';
import TextEditorWrapper from './TextEditorWrapper';

function TextEditorItem({
  editable = true,
  text,
  onChange,
  onFocus,
  onBlur,
  onReadOnlyChecked,
  onUpdateNote,
}) {
  const isMobile = useIsMobileSize();

  // eslint-disable-next-line no-unused-vars
  const [_, setInnerText] = useAutoSave(onUpdateNote, 1500);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      TaskItem.configure({
        nested: true,
        onReadOnlyChecked: onReadOnlyChecked
          ? (node, checked, html) => {
              onReadOnlyChecked(html);
            }
          : null,
      }),
      TaskList,
    ],
    content: '',
    editable,
  });

  const onFocusRef = useRefValue(onFocus);
  const onBlurRef = useRefValue(onBlur);

  useEffect(() => {
    const handleUpdate = () => {
      const html = editor.getHTML();
      onChange(html);
      setInnerText(html);
    };
    const handleFocus = () => {
      if (onFocusRef.current) {
        onFocusRef.current(editor);
      }
    };
    const handleBlur = () => {
      if (onBlurRef.current) {
        onBlurRef.current(editor);
      }
    };

    if (editor) {
      editor.on('update', handleUpdate);
      editor.on('focus', handleFocus);
      editor.on('blur', handleBlur);
    }

    return () => {
      if (editor) {
        editor.off('update', handleUpdate);
        editor.off('focus', handleFocus);
        editor.off('blur', handleBlur);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    if (editor) {
      if (text !== editor.getHTML()) {
        editor.commands.setContent(text || '');
      }
    }
  }, [editor, text]);

  return (
    <>
      {editable && !!editor && <TextEditorToolbar editor={editor} />}
      <TextEditorWrapper
        editable={editable}
        maxWidth={isMobile ? 'calc(100vw - 2rem)' : `${breakpoint}px`}
      >
        <EditorContent editor={editor} placeholder="Type something ..." />
      </TextEditorWrapper>
    </>
  );
}

export default TextEditorItem;
