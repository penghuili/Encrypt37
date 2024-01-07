import { connect } from 'react-redux';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import { fileActions, fileSelectors } from '../../store/file/fileStore';
import { filePostActions, filePostSelectors } from '../../store/filePost/filePostStore';
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
  onUpdate: filePostActions.updateRequested,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostItem);
