import { connect } from 'react-redux';

import sharedSelectors from '../../shared/react/store/sharedSelectors';
import Account from './Account';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import { fileActions, fileSelectors } from '../../shared/react/store/file/fileStore';

const mapStateToProps = state => ({
  account: sharedSelectors.getAccount(state),
  expiresAt: sharedSelectors.getExpiresAt(state),
  settings: fileSelectors.data.getSettings(state),
  isLoadingAccount: sharedSelectors.isLoadingAccount(state),
  isLoadingFileSettings: fileSelectors.fetchSettings.isPending(state),
});

const mapDispatchToProps = {
  onFetchSettings: fileActions.fetchSettingsRequested,
  onLogOut: sharedActionCreators.logOutPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
