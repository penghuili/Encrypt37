import { connect } from 'react-redux';

import { groupActions, groupSelectors } from '../../store/group/groupStore';
import GroupUpdate from './GroupUpdate';

const mapStateToProps = (state, { params: { groupId } }) => ({
  groupId,
  group: groupSelectors.data.getStandaloneItem(state),
  isLoading: groupSelectors.fetchItem.isPending(state),
  isUpdating: groupSelectors.updateItem.isPending(state),
});

const mapDispatchToProps = {
  onFetchGroup: groupActions.fetchItemRequested,
  onUpdate: groupActions.updateRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupUpdate);
