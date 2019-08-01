import { PersistenceFunction } from '../middleware/persist-data';
import Run from '../interfaces/Run';
import RunStatus from '../interfaces/RunStatus';
import { Point } from 'electron';

const influxDataPersistence: PersistenceFunction = async (
    run: Run,
    runStatus: RunStatus,
    data: Point[]
) => {
    console.log(`called with ${run}, ${runStatus}, ${data}, but I actually don't do shit yet lmao`);
};

export default influxDataPersistence;
