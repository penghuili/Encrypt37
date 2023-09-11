import { connect } from 'react-redux';

import { fileActions } from '../../shared/react/store/file/fileStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import { groupActions, groupSelectors } from '../../store/group/groupStore';
import GroupsUpdater from './GroupsUpdater';

const mapStateToProps = state => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupsUpdater);
