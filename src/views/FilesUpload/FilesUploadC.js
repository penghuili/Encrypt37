import { connect } from 'react-redux';

import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import FilesUpload from './FilesUpload';

const mapStateToProps = state => ({
  isCreating: fileSelectors.createItem.isPending(state),
});

const mapDispatchToProps = {
  onUpload: fileActions.createRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesUpload);
