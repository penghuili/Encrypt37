import { connect } from 'react-redux';

import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import sharedSelectors from '../../shared/react/store/sharedSelectors';
import Expired from './Expired';

const mapStateToProps = state => ({
  isTrying: sharedSelectors.isTrying(state),
  tried: sharedSelectors.tried(state),
  isExpired: !sharedSelectors.isAccountValid(state),
});

const mapDispatchToProps = {
  onTry: sharedActionCreators.tryPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(Expired);
