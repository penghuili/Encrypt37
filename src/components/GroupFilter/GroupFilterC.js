import { connect } from 'react-redux';

import { groupSelectors } from '../../store/group/groupStore';
import GroupFilter from './GroupFilter';

const mapStateToProps = (state) => {
  return {
    groups: groupSelectors.data.getItems(state),
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupFilter);
