import { connect } from 'react-redux';

import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import FileItem from './FileItem';

const mapStateToProps = (state, { fileId }) => ({
  fileId,
  isDownloadingFile: fileSelectors.downloadFile.isPending(state),
  isDownloadingThumbnail: fileSelectors.downloadThumbnail.isPending(state),
  isDeleting: fileSelectors.deleteItem.isPending(state),
  fileMeta: fileSelectors.data.getItem(state, undefined, fileId),
  file: fileSelectors.data.getFile(state, fileId),
  thumbnail: fileSelectors.data.getThumbnail(state, fileId),
});

const mapDispatchToProps = {
  onDownloadFile: fileActions.downloadFileRequested,
  onDownloadThumbnail: fileActions.downloadThumbnailRequested,
  onDelete: fileActions.deleteRequested,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(FileItem);
