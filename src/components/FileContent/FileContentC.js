import { connect } from 'react-redux';

import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import FileContent from './FileContent';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';

const mapStateToProps = (state, { fileId }) => {
  return {
    fileId,
    fileMeta: fileSelectors.data.getItem(state, fileId),
    isDownloadingFile: fileSelectors.downloadFile.isPending(state),
    rawFile: fileSelectors.data.getRawFile(state, fileId),
    thumbnail: fileSelectors.data.getThumbnail(state, fileId),
    isDeleting: fileSelectors.deleteItem.isPending(state),
  };
};

const mapDispatchToProps = {
  onFetch: fileActions.fetchItemRequested,
  onDelete: fileActions.deleteRequested,
  onDownloadFile: fileActions.downloadFileRequested,
  onDownloadThumbnail: fileActions.downloadThumbnailRequested,
  onNav: sharedActionCreators.navigate,
  onToast: sharedActionCreators.setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(FileContent);
