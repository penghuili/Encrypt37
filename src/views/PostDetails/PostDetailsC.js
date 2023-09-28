import { connect } from 'react-redux';

import { filePostActions, filePostSelectors } from '../../shared/react/store/file/filePostStore';
import { groupActions } from '../../store/group/groupStore';
import PostDetails from './PostDetails';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import { fileSelectors } from '../../shared/react/store/file/fileStore';

const mapStateToProps = (state, { params: { postId } }) => ({
  postId,
  post: filePostSelectors.data.getStandaloneItem(state),
  isLoading: filePostSelectors.fetchItem.isPending(state),
  isDeleting: filePostSelectors.deleteItem.isPending(state),
  isCreating: fileSelectors.createItem.isPending(state),
});

const mapDispatchToProps = {
  onFetch: filePostActions.fetchItemRequested,
  onFetchGroups: groupActions.fetchItemsRequested,
  onDelete: filePostActions.deleteRequested,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);
