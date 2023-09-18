import { connect } from 'react-redux';

import { filePostActions, filePostSelectors } from '../../shared/react/store/file/filePostStore';
import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import PostItem from './PostItem';

const mapStateToProps = (state, { fileId }) => {
  return {
    fileId,
    isDownloadingFile: fileSelectors.downloadFile.isPending(state),
    isDeleting: filePostSelectors.deleteItem.isPending(state),
  };
};

const mapDispatchToProps = {
  onDownloadFile: fileActions.downloadFileRequested,
  onDelete: filePostActions.deleteRequested,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostItem);
