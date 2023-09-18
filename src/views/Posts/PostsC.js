import { connect } from 'react-redux';

import { filePostActions, filePostSelectors } from '../../shared/react/store/file/filePostStore';
import { fileSelectors } from '../../shared/react/store/file/fileStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import { groupActions } from '../../store/group/groupStore';
import Posts from './Posts';

const mapStateToProps = state => {
  return {
    posts: filePostSelectors.data.getItems(state),
    hasMore: filePostSelectors.data.hasMore(state),
    startKey: filePostSelectors.data.getStartKey(state),
    isLoading: filePostSelectors.fetchItems.isPending(state),
    isCreatingPost: filePostSelectors.createItem.isPending(state),
    isCreatingFile: fileSelectors.createItem.isPending(state),
    isDeletingPost: filePostSelectors.deleteItem.isPending(state),
    isDeletingFile: fileSelectors.deleteItem.isPending(state),
  };
};

const mapDispatchToProps = {
  onFetch: filePostActions.fetchItemsRequested,
  onFetchGroups: groupActions.fetchItemsRequested,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
