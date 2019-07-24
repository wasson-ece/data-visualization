import Controller from './Controller';

export default class MCO extends Controller {
    kP: number;
    kI: number;
    kD: number;

    constructor(
        id: string,
        reading: number = NaN,
        pollRate: number = NaN,
        kP: number = NaN,
        kI: number = NaN,
        kD: number = NaN
    ) {
        super(id, reading, pollRate);
        this.kP = kP;
        this.kI = kI;
        this.kD = kD;
    }
}
