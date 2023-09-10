import { connect } from 'react-redux';

import { groupActions, groupSelectors } from '../../store/group/groupStore';
import Groups from './Groups';

const mapStateToProps = state => ({
  isLoading: groupSelectors.fetchItems.isPending(state),
  groups: groupSelectors.data.getItems(state),
  isDeleting: groupSelectors.deleteItem.isPending(state),
});

const mapDispatchToProps = {
  onFetch: groupActions.fetchItemsRequested,
  onDelete: groupActions.deleteRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
