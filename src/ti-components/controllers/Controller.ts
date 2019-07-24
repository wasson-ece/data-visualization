export default class Controller {
    id: string;
    setpoint: number;
    actual: number;

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
