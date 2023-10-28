import { connect } from 'react-redux';
import { fileActions, fileSelectors } from '../../store/file/fileStore';
import { filePostActions, filePostExtraSelectors, filePostSelectors } from '../../store/filePost/filePostStore';
import { noteActions, noteSelectors } from '../../store/note/noteStore';
import TextEditorWithFile from './TextEditorWithFile';

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
  onDeleteFileAndCombineNotes: filePostActions.deleteFileAndCombineNotesRequested,
  onAttachFilesToPost: filePostActions.attachFilesToPostRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditorWithFile);
