import HeaterDatum from './HeaterDatum';
import HeaterComponent from 'node-ti/build/ti-components/heater-component';

export default interface Heater extends HeaterComponent {
    data: HeaterDatum[];
}
