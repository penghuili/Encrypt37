import { connect } from 'react-redux';

import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import Files from './Files';

const mapStateToProps = state => {
  return {
    files: fileSelectors.data.getGroupItems(state),
    isLoading: fileSelectors.fetchItems.isPending(state),
    isCreating: fileSelectors.createItem.isPending(state),
  };
};

const mapDispatchToProps = {
  onFetch: fileActions.fetchItemsRequested,
  onUpload: fileActions.createRequested,
  onToast: sharedActionCreators.setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(Files);
