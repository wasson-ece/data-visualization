import Detector from './Detector';

export default class FID extends Detector {
    constructor(id: string, reading: number = NaN, pollRate: number = NaN) {
        super(id, reading, pollRate);
    }
}
