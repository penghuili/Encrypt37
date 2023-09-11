import { connect } from 'react-redux';

import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import FileContent from './FileContent';

const mapStateToProps = (state, { fileId }) => {
  return {
    fileId,
    isDownloadingFile: fileSelectors.downloadFile.isPending(state),
    file: fileSelectors.data.getFile(state, fileId),
    thumbnail: fileSelectors.data.getThumbnail(state, fileId),
  };
};

const mapDispatchToProps = {
  onDownloadFile: fileActions.downloadFileRequested,
  onDownloadThumbnail: fileActions.downloadThumbnailRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(FileContent);
