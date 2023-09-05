import { connect } from 'react-redux';

import { groupSelectors } from '../../store/group/groupStore';
import SelectedGroups from './SelectedGroups';

const mapStateToProps = state => ({
  groupsObj: groupSelectors.data.getGroupsObj(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SelectedGroups);
