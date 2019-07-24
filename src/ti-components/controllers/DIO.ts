import Controller from './Controller';

export default class DIO extends Controller {
    constructor(id: string, reading: number = NaN, pollRate: number = NaN) {
        super(id, reading, pollRate);
    }
}
