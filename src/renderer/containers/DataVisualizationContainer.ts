import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Counter from '../components/ChartContainer';
import { RootState } from '../reducers';
import {
    addController,
    removeController,
    setControllerAttribute,
    ControllersAction
} from '../actions/controllersActions';

const mapStateToProps = (state: RootState) => ({
    // value: state.counter.value
});

const mapDispatchToProps = (dispatch: Dispatch<ControllersAction>) => ({
    // incrementValue: () => dispatch(increment()),
    // decrementValue: () => dispatch(decrement())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter);
