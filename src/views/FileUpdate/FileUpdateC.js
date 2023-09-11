import { connect } from 'react-redux';

import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import FileUpdate from './FileUpdate';

const mapStateToProps = (state, { params: { fileId } }) => ({
  fileId,
  fileMeta: fileSelectors.data.getStandaloneItem(state),
  isLoading: fileSelectors.fetchItem.isPending(state),
  isUpdating: fileSelectors.updateItem.isPending(state),
});

const mapDispatchToProps = {
  onFetch: fileActions.fetchItemRequested,
  onUpdate: fileActions.updateRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(FileUpdate);
