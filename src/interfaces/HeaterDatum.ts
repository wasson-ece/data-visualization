import { Point } from 'electron';

export default interface HeaterDatum extends Point {
    runId: string;
}
