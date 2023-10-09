import { connect } from 'react-redux';

import { filePostActions, filePostSelectors } from '../../shared/react/store/file/filePostStore';
import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import { noteActions, noteSelectors } from '../../store/note/noteStore';
import TextEditorWithFile from './TextEditorWithFile';
import { filePostExtraActions, filePostExtraSelectors } from '../../store/filePost/filePostStore';

const mapStateToProps = state => {
  return {
    isCreatingNote: noteSelectors.createItem.isPending(state),
    isUpdatingNote: noteSelectors.updateItem.isPending(state),
    isDeletingNote: noteSelectors.deleteItem.isPending(state),
    isCreatingFile: fileSelectors.createItem.isPending(state),
    isDeletingFile: fileSelectors.deleteItem.isPending(state),
    isDeletingFileAndCombineNotes:
      filePostExtraSelectors.deleteFileAndCombineNotes.isPending(state),
    isAttachingFiles: filePostExtraSelectors.attachFilesToPost.isPending(state),
    isUpdatingPost: filePostSelectors.updateItem.isPending(state),
  };
};

const mapDispatchToProps = {
  onCreateNote: noteActions.createRequested,
  onUpdateNote: noteActions.updateRequested,
  onDeleteNote: noteActions.deleteRequested,
  onDeleteFile: fileActions.deleteRequested,
  onUpdatePost: filePostActions.updateRequested,
  onDeleteFileAndCombineNotes: filePostExtraActions.deleteFileAndCombineNotesRequested,
  onAttachFilesToPost: filePostExtraActions.attachFilesToPostRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditorWithFile);
