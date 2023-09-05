import { connect } from 'react-redux';

import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import { groupActions } from '../../store/group/groupStore';
import Files from './Files';

const mapStateToProps = state => {
  return {
    files: fileSelectors.data.getGroupItems(state),
    hasMore: fileSelectors.data.hasMore(state),
    startKey: fileSelectors.data.getStartKey(state),
    isLoading: fileSelectors.fetchItems.isPending(state),
    isCreating: fileSelectors.createItem.isPending(state),
  };
};

const mapDispatchToProps = {
  onFetch: fileActions.fetchItemsRequested,
  onFetchGroups: groupActions.fetchItemsRequested,
  onToast: sharedActionCreators.setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(Files);
