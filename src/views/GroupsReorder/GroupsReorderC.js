import { connect } from 'react-redux';

import { groupActions, groupSelectors } from '../../store/group/groupStore';
import GroupsReorder from './GroupsReorder';

const mapStateToProps = state => ({
  isLoading: groupSelectors.fetchItems.isPending(state),
  groups: groupSelectors.data.getItems(state),
});

const mapDispatchToProps = {
  onFetch: groupActions.fetchItemsRequested,
  onUpdate: groupActions.updateRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsReorder);
