import TimeSeriesDatum from './TimeSeriesDatum';

export default interface ControllerDatum<T> extends TimeSeriesDatum {
    setpoint: number;
    parameters?: T;
}
