import Controller from './Controller';
import ControllerType from '../../enums/ControllerType';

export default class EPC extends Controller {
    type: ControllerType = ControllerType.Epc;

    constructor(id: string, reading: number = NaN, pollRate: number = NaN) {
        super(id, reading, pollRate);
    }
}
