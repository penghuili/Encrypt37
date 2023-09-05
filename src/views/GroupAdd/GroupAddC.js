import { connect } from 'react-redux';

import { groupActions, groupSelectors } from '../../store/group/groupStore';
import GroupAdd from './GroupAdd';

const mapStateToProps = state => ({
  isCreating: groupSelectors.createItem.isPending(state),
});

const mapDispatchToProps = {
  onCreate: groupActions.createRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupAdd);
