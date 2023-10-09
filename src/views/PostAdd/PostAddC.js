import { connect } from 'react-redux';

import { filePostActions, filePostSelectors } from '../../shared/react/store/file/filePostStore';
import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import { noteActions, noteSelectors } from '../../store/note/noteStore';
import PostAdd from './PostAdd';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';

const mapStateToProps = state => ({
  isCreatingPost: filePostSelectors.createItem.isPending(state),
  isCreatingNote: noteSelectors.createItem.isPending(state),
  isCreatingFile: fileSelectors.createItem.isPending(state),
});

const mapDispatchToProps = {
  onCreatePost: filePostActions.createRequested,
  onCreateNote: noteActions.createRequested,
  onCreateFile: fileActions.createRequested,
  onToast: sharedActionCreators.setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostAdd);
