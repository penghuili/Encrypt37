import { connect } from 'react-redux';

import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import sharedSelectors from '../../shared/react/store/sharedSelectors';
import Tickets from './Tickets';

const mapStateToProps = state => ({
  account: sharedSelectors.getAccount(state),
  isLoading: sharedSelectors.isLoadingSettings(state),
});

const mapDispatchToProps = {
  onToast: sharedActionCreators.setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tickets);
