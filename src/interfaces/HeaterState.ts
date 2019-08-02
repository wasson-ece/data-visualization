import Heater from './Heater';
import Run from './Run';

export default interface HeaterState extends Heater {
    runs: Run[];
    currentRun?: string;
}
