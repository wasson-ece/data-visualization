import ControllerComponent from './ControllerComponent';
import HeaterDatum from './HeaterDatum';

export default interface Heater extends ControllerComponent {
    kp: number;
    ki: number;
    kd: number;
    output: number;
    data: HeaterDatum[];
}
