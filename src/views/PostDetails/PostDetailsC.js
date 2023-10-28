import { connect } from 'react-redux';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import sharedSelectors from '../../shared/react/store/sharedSelectors';
import { filePostActions, filePostSelectors } from '../../store/filePost/filePostStore';
import { groupActions } from '../../store/group/groupStore';
import PostDetails from './PostDetails';

const mapStateToProps = (state, { params: { postId } }) => ({
  postId,
  post: filePostSelectors.data.getStandaloneItem(state),
  isLoading: filePostSelectors.fetchItem.isPending(state),
  isDeleting: filePostSelectors.deleteItem.isPending(state),
  isExpired: !sharedSelectors.isAccountValid(state),
});

const mapDispatchToProps = {
  onFetch: filePostActions.fetchItemRequested,
  onFetchGroups: groupActions.fetchItemsRequested,
  onDelete: filePostActions.deleteRequested,
  onUpdate: filePostActions.updateRequested,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);
