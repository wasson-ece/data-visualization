import { PersistenceFunction } from '../middleware/persist-data';
import Run from '../interfaces/Run';
import HeaterDatum from '../interfaces/HeaterDatum';

const influxDataPersistence: PersistenceFunction = async (run: Run, data: HeaterDatum[]) => {
    console.log(`called with ${run}, ${data}, but I actually don't do shit yet lmao`);
};

export default influxDataPersistence;
