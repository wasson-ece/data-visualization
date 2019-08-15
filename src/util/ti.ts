import HeaterController from 'node-ti/build/ti-components/heater-controller';
import EpcController from 'node-ti/build/ti-components/epc-controller';
import MfcController from 'node-ti/build/ti-components/mfc-controller';
import DioController from 'node-ti/build/ti-components/dio-controler';
import AnalogComponent from 'node-ti/build/ti-components/analog-component';
import TIComponent, {
    isEpcController,
    isAnalogComponent,
    isDioController,
    isMfcController
} from 'node-ti/build/ti-components/ti-component';
import { isHeaterComponent } from './heater-run';

export interface Components {
    heaters: HeaterController[];
    epcs: EpcController[];
    mfcs: MfcController[];
    dio: DioController | undefined;
    analog: AnalogComponent | undefined;
}

export const separateTiComponents = (components: TIComponent[]): Components => {
    /* Parse result into the constituent Ti components */
    let heaters = components.filter(isHeaterComponent);
    let epcs = components.filter(isEpcController);
    let mfcs = components.filter(isMfcController);
    let analog = components.find(isAnalogComponent);
    let dio = components.find(isDioController);

    return { heaters, epcs, mfcs, analog, dio };
};
