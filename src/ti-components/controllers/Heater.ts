import Controller from './Controller';
import ControllerType from '../../enums/ControllerType';

export default class Heater extends Controller {
    kP: number;
    kI: number;
    kD: number;
    type: ControllerType = ControllerType.Heater;

    constructor(
        id: string,
        setpoint: number = NaN,
        actual: number = NaN,
        kP: number = NaN,
        kI: number = NaN,
        kD: number = NaN
    ) {
        super(id, setpoint, actual);
        this.kP = kP;
        this.kI = kI;
        this.kD = kD;
        this.setpoint = setpoint;
    }
}
