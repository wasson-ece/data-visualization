import ControllerType from '../../enums/ControllerType';

export default abstract class Controller {
    id: string;
    setpoint: number;
    actual: number;
    abstract type: ControllerType;

    constructor(id: string, setpoint: number = NaN, actual: number = NaN) {
        this.id = id;
        this.setpoint = setpoint;
        this.actual = actual;
    }

    getActual = () => this.actual;

    setActual = (actual: number) => (this.actual = actual);

    getSetpoint = () => this.setpoint;

    setSetpoint = (setpoint: number) => (this.setpoint = setpoint);
}
