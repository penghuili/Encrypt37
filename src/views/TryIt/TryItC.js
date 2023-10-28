import { connect } from 'react-redux';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import sharedSelectors from '../../shared/react/store/sharedSelectors';
import TryIt from './TryIt';

const mapStateToProps = state => ({
  isTrying: sharedSelectors.isTrying(state),
});

const mapDispatchToProps = {
  onTry: sharedActionCreators.tryPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(TryIt);
