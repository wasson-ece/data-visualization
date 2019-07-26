import Controller from './Controller';
import ControllerType from '../../enums/ControllerType';

export default class MFC extends Controller {
    type: ControllerType = ControllerType.Mfc;

    constructor(id: string, reading: number = NaN, pollRate: number = NaN) {
        super(id, reading, pollRate);
    }
}
