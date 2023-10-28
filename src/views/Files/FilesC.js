import { connect } from 'react-redux';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import { fileActions, fileSelectors } from '../../store/file/fileStore';
import Files from './Files';

const mapStateToProps = state => {
  return {
    files: fileSelectors.data.getItems(state),
    hasMore: fileSelectors.data.hasMore(state),
    startKey: fileSelectors.data.getStartKey(state),
    isLoading: fileSelectors.fetchItems.isPending(state),
  };
};

const mapDispatchToProps = {
  onFetch: fileActions.fetchItemsRequested,
  onToast: sharedActionCreators.setToast,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Files);
