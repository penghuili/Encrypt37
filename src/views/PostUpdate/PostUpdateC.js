import { connect } from 'react-redux';

import { filePostActions, filePostSelectors } from '../../shared/react/store/file/filePostStore';
import PostUpdate from './PostUpdate';

const mapStateToProps = (state, { params: { postId } }) => ({
  postId,
  post: filePostSelectors.data.getStandaloneItem(state),
  isLoading: filePostSelectors.fetchItem.isPending(state),
  isUpdating: filePostSelectors.updateItem.isPending(state),
});

const mapDispatchToProps = {
  onFetch: filePostActions.fetchItemRequested,
  onUpdate: filePostActions.updateRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostUpdate);
