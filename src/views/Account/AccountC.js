import { connect } from 'react-redux';

import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import sharedSelectors from '../../shared/react/store/sharedSelectors';
import Account from './Account';

const mapStateToProps = state => ({
  account: sharedSelectors.getAccount(state),
  expiresAt: sharedSelectors.getExpiresAt(state),
  settings: sharedSelectors.getSettings(state),
  isLoadingAccount: sharedSelectors.isLoadingAccount(state),
  isLoadingSettings: sharedSelectors.isLoadingSettings(state),
});

const mapDispatchToProps = {
  onFetchSettings: sharedActionCreators.fetchSettingsRequested,
  onLogOut: sharedActionCreators.logOutPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
