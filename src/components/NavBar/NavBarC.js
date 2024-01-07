import { connect } from 'react-redux';
import sharedSelectors from '../../shared/react/store/sharedSelectors';
import NavBar from './NavBar';

const mapStateToProps = state => {
  return {
    isLoggedIn: sharedSelectors.isLoggedIn(state),
    isExpired: !sharedSelectors.isAccountValid(state),
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
