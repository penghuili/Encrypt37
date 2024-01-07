import { connect } from 'react-redux';
import sharedSelectors from '../../shared/react/store/sharedSelectors';
import ExpiredBanner from './ExpiredBanner';

const mapStateToProps = state => {
  return {
    isExpired: !sharedSelectors.isAccountValid(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ExpiredBanner);
