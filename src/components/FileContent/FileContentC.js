import { connect } from 'react-redux';

import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import FileContent from './FileContent';

const mapStateToProps = (state, { fileId }) => {
  return {
    fileId,
    fileMeta: fileSelectors.data.getItem(state, fileId),
    isDownloadingFile: fileSelectors.downloadFile.isPending(state),
    rawFile: fileSelectors.data.getRawFile(state, fileId),
    thumbnail: fileSelectors.data.getThumbnail(state, fileId),
  };
};

const mapDispatchToProps = {
  onFetch: fileActions.fetchItemRequested,
  onDownloadFile: fileActions.downloadFileRequested,
  onDownloadThumbnail: fileActions.downloadThumbnailRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(FileContent);
