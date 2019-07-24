import Controller from './Controller';

export default class EPC extends Controller {
    constructor(id: string, reading: number = NaN, pollRate: number = NaN) {
        super(id, reading, pollRate);
    }
}
