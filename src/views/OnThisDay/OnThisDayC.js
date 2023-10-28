import { connect } from 'react-redux';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import sharedSelectors from '../../shared/react/store/sharedSelectors';
import { filePostActions, filePostSelectors } from '../../store/filePost/filePostStore';
import { groupActions } from '../../store/group/groupStore';
import OnThisDay from './OnThisDay';

const mapStateToProps = state => {
  return {
    posts: filePostSelectors.data.getItems(state),
    hasMore: filePostSelectors.data.hasMore(state),
    startKey: filePostSelectors.data.getStartKey(state),
    settings: sharedSelectors.getSettings(state),
    isLoading: filePostSelectors.fetchItems.isPending(state),
    isDeletingPost: filePostSelectors.deleteItem.isPending(state),
  };
};

const mapDispatchToProps = {
  onFetch: filePostActions.fetchItemsRequested,
  onFetchGroups: groupActions.fetchItemsRequested,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnThisDay);
