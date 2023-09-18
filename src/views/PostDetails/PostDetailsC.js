import { connect } from 'react-redux';

import { filePostActions, filePostSelectors } from '../../shared/react/store/file/filePostStore';
import { groupActions } from '../../store/group/groupStore';
import PostDetails from './PostDetails';

const mapStateToProps = (state, { params: { postId } }) => ({
  postId,
  post: filePostSelectors.data.getStandaloneItem(state),
  isLoading: filePostSelectors.fetchItem.isPending(state),
});

const mapDispatchToProps = {
  onFetch: filePostActions.fetchItemRequested,
  onFetchGroups: groupActions.fetchItemsRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);
