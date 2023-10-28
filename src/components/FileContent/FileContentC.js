import { connect } from 'react-redux';
import sharedSelectors from '../../shared/react/store/sharedSelectors';
import { fileActions, fileSelectors } from '../../store/file/fileStore';
import FileContent from './FileContent';

const mapStateToProps = (state, { fileId }) => {
  return {
    fileId,
    fileMetaInStore: fileSelectors.data.getItem(state, fileId),
    isDownloadingFile: fileSelectors.downloadFile.isPending(state),
    rawFile: fileSelectors.data.getRawFile(state, fileId),
    thumbnail: fileSelectors.data.getThumbnail(state, fileId),
    isAccountValid: sharedSelectors.isAccountValid(state),
  };
};

const mapDispatchToProps = {
  onFetch: fileActions.fetchItemRequested,
  onDownloadFile: fileActions.downloadFileRequested,
  onDownloadThumbnail: fileActions.downloadThumbnailRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(FileContent);
