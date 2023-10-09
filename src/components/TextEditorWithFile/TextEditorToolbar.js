import { Button, Text } from 'grommet';
import {
  BlockQuote,
  Bold,
  Checkbox,
  Clear,
  Code,
  Command,
  FormNext,
  FormPrevious,
  Italic,
  List,
  OrderedList,
  Redo,
  StrikeThrough,
  Subtract,
  Undo,
} from 'grommet-icons';
import React from 'react';
import styled from 'styled-components';

import { getColor } from '../../shared/react-pure/color';
import { useBackgroundColor } from '../../shared/react-pure/createTheme';

const MenuWrapper = styled.div`
  padding: 4px 16px;

  position: sticky;
  top: ${({ top }) => top}px;
  z-index: 1;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  border: 1px solid ${getColor('light-4')};
  background-color: ${({ background }) => background};
`;

function HeaderIcon({ color }) {
  return (
    <Text size="24px" color={color}>
      H
    </Text>
  );
}

function ToolIcon({ IconComponent, isActive, onClick, tip, disabled, margin = '0 8px 0 0' }) {
  return (
    <Button
      icon={<IconComponent color={isActive ? 'brand' : undefined} />}
      onClick={onClick}
      plain
      margin={margin}
      tip={tip ? { content: tip, plain: false, dropProps: { background: 1 } } : undefined}
      disabled={disabled}
    />
  );
}

function TextEditorToolbar({ editor }) {
  const backgroundColor = useBackgroundColor();

  if (!editor) {
    return null;
  }

  return (
    <MenuWrapper top={0} background={backgroundColor}>
      <ToolIcon
        IconComponent={Bold}
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        tip="Bold"
      />
      <ToolIcon
        IconComponent={Italic}
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        tip="Italic"
      />
      <ToolIcon
        IconComponent={StrikeThrough}
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        tip="Strike through"
      />
      <ToolIcon
        IconComponent={Code}
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
        tip="Code"
      />
      <ToolIcon
        IconComponent={HeaderIcon}
        isActive={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        tip="Header"
        margin="0"
      />
      <Text size="24px" color="light-5" margin="0 1rem">
        |
      </Text>
      <ToolIcon
        IconComponent={Checkbox}
        isActive={editor.isActive('taskList')}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        tip="Todo"
      />
      <ToolIcon
        IconComponent={List}
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        tip="Bullet list"
      />
      <ToolIcon
        IconComponent={OrderedList}
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        tip="Ordered list"
      />
      <ToolIcon
        IconComponent={FormNext}
        onClick={() => {
          if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
            editor.chain().focus().sinkListItem('listItem').run();
          } else if (editor.isActive('taskList')) {
            editor.chain().focus().sinkListItem('taskItem').run();
          }
        }}
        disabled={!editor.can().sinkListItem('listItem') && !editor.can().sinkListItem('taskItem')}
        tip="Decrease indent"
      />
      <ToolIcon
        IconComponent={FormPrevious}
        onClick={() => {
          if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
            editor.chain().focus().liftListItem('listItem').run();
          } else if (editor.isActive('taskList')) {
            editor.chain().focus().liftListItem('taskItem').run();
          }
        }}
        disabled={!editor.can().liftListItem('listItem') && !editor.can().liftListItem('taskItem')}
        tip="Increase indent"
        margin="0"
      />
      <Text size="24px" color="light-5" margin="0 1rem">
        |
      </Text>
      <ToolIcon
        IconComponent={Command}
        isActive={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        tip="Code block"
      />
      <ToolIcon
        IconComponent={BlockQuote}
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        tip="Blockquote"
      />
      <ToolIcon
        IconComponent={Subtract}
        isActive={false}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        tip="Divider"
        margin="0"
      />
      <Text size="24px" color="light-5" margin="0 1rem">
        |
      </Text>
      <ToolIcon
        IconComponent={Undo}
        isActive={false}
        onClick={() => editor.chain().focus().undo().run()}
        tip="Undo"
      />
      <ToolIcon
        IconComponent={Redo}
        isActive={false}
        onClick={() => editor.chain().focus().redo().run()}
        tip="Redo"
      />
      <ToolIcon
        IconComponent={Clear}
        isActive={false}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        tip="Clear formatting"
      />
    </MenuWrapper>
  );
}

export default TextEditorToolbar;
