import { connect } from 'react-redux';

import { filePostActions, filePostSelectors } from '../../shared/react/store/file/filePostStore';
import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import FilesUpload from './FilesUpload';
import sharedSelectors from '../../shared/react/store/sharedSelectors';

const mapStateToProps = state => ({
  settings: sharedSelectors.getSettings(state),
  isCreatingPost: filePostSelectors.createItem.isPending(state),
  isCreating: fileSelectors.createItem.isPending(state),
});

const mapDispatchToProps = {
  onCreatePost: filePostActions.createRequested,
  onUpload: fileActions.createRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesUpload);
