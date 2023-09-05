import { connect } from 'react-redux';

import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import { groupActions, groupSelectors } from '../../store/group/groupStore';
import GroupsModal from './GroupsModal';

const mapStateToProps = (state, { fileId }) => {
  return {
    fileId,
    file: fileSelectors.data.getStandaloneItem(state),
    groups: groupSelectors.data.getItems(state),
    getIsAddingGroupItem: groupId => groupSelectors.createGroupItem.isPending(state, groupId),
    getIsDeletingGroupItem: groupId => groupSelectors.deleteGroupItem.isPending(state, groupId),
  };
};

const mapDispatchToProps = {
  onFetchFile: fileActions.fetchItemRequested,
  onFetchGroups: groupActions.fetchItemsRequested,
  onAdd: groupActions.createGroupItemRequested,
  onDelete: groupActions.deleteGroupItemRequested,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsModal);
