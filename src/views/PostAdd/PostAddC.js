import { connect } from 'react-redux';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import { filePostExtraActions, filePostExtraSelectors } from '../../store/filePost/filePostStore';
import PostAdd from './PostAdd';

const mapStateToProps = state => ({
  isAttachingFiles: filePostExtraSelectors.attachFilesToPost.isPending(state),
});

const mapDispatchToProps = {
  onAttachFilesToPost: filePostExtraActions.attachFilesToPostRequested,
  onToast: sharedActionCreators.setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostAdd);
