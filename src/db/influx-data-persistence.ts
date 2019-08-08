import * as Influx from 'influx';
import { PersistenceFunction } from '../middleware/persist-data';
import Run from '../interfaces/Run';
import HeaterDatum from '../interfaces/HeaterDatum';
import influxEnv from '../env/influx.env';

const MEASUREMENT_NAME = 'heater2';

const influxDataPersistence: PersistenceFunction = async (
    id: string,
    run: Run,
    data: HeaterDatum[]
) => {
    const { host, port, database, username, password } = influxEnv;

    const influx = new Influx.InfluxDB({
        host,
        database,
        username,
        password,
        schema: [
            {
                measurement: MEASUREMENT_NAME,
                fields: {
                    kp: Influx.FieldType.INTEGER,
                    ki: Influx.FieldType.INTEGER,
                    kd: Influx.FieldType.INTEGER,
                    setpoint: Influx.FieldType.FLOAT,
                    actual: Influx.FieldType.FLOAT,
                    setpointHoldTime: Influx.FieldType.FLOAT
                },
                tags: ['run', 'instrumentId']
            }
        ]
    });
    console.log(data.map(datum => makeInfluxPoint(id, run, datum)));
    influx.writePoints(data.map(datum => makeInfluxPoint(id, run, datum))).catch(console.log);
};

const makeInfluxPoint = (instrumentId: string, run: Run, datum: HeaterDatum): Influx.IPoint => ({
    measurement: MEASUREMENT_NAME,
    tags: { run: datum.runId, instrumentId },
    timestamp: 1e6 * Number(datum.x), // Influx time is in ns, not ms
    fields: {
        setpoint: Number(run.setpoint),
        actual: Number(datum.y),
        kp: Number(run.kp),
        ki: Number(run.ki),
        kd: Number(run.kd),
        setpointHoldTime: 1e9 * 60 * Number(run.setpointHoldTime) // Convert from minutes to ns
    }
});

export default influxDataPersistence;
