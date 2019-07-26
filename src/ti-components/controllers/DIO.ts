import Controller from './Controller';
import ControllerType from '../../enums/ControllerType';

export default class DIO extends Controller {
    type: ControllerType = ControllerType.Dio;

    constructor(id: string, reading: number = NaN, pollRate: number = NaN) {
        super(id, reading, pollRate);
    }
}
