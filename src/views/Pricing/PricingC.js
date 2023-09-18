import { connect } from 'react-redux';

import sharedSelectors from '../../shared/react/store/sharedSelectors';
import Pricing from './Pricing';

const mapStateToProps = state => ({ isLoggedIn: sharedSelectors.isLoggedIn(state) });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Pricing);
