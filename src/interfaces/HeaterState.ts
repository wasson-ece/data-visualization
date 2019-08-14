import Run from './Run';
import HeaterController from 'node-ti/build/ti-components/heater-controller';
import HeaterDatum from './HeaterDatum';

export default interface HeaterState extends HeaterController {
    runs: Run[];
    currentRun?: string;
    label: string;
    data: HeaterDatum[];
}
