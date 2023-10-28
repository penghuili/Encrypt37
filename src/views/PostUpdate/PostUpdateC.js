import { connect } from 'react-redux';
import { filePostActions, filePostSelectors } from '../../store/filePost/filePostStore';
import PostUpdate from './PostUpdate';

const mapStateToProps = (state, { params: { postId } }) => ({
  postId,
  post: filePostSelectors.data.getStandaloneItem(state),
  isLoading: filePostSelectors.fetchItem.isPending(state),
});

const mapDispatchToProps = {
  onFetch: filePostActions.fetchItemRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostUpdate);
