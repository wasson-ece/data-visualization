import * as Influx from 'influx';
import { PersistenceFunction } from '../middleware/persist-data';
import Run from '../interfaces/Run';
import HeaterDatum from '../interfaces/HeaterDatum';
import influxEnv from '../env/influx.env';

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
                measurement: 'heater',
                fields: {
                    id: Influx.FieldType.STRING,
                    kp: Influx.FieldType.INTEGER,
                    ki: Influx.FieldType.INTEGER,
                    kd: Influx.FieldType.INTEGER,
                    setpoint: Influx.FieldType.FLOAT,
                    actual: Influx.FieldType.FLOAT,
                    timestamp: Influx.FieldType.INTEGER,
                    setpointHoldTime: Influx.FieldType.FLOAT
                },
                tags: ['run']
            }
        ]
    });
    influx.writePoints(data.map(datum => makeInfluxPoint(id, run, datum))).catch(console.log);
};

const makeInfluxPoint = (id: string, run: Run, datum: HeaterDatum): Influx.IPoint => ({
    measurement: 'heater',
    tags: { run: datum.runId },
    fields: {
        setpoint: Number(run.setpoint),
        actual: Number(datum.y),
        kp: Number(run.kp),
        ki: Number(run.ki),
        kd: Number(run.kd),
        setpointHoldTime: 1e9 * 60 * Number(run.setpointHoldTime), // Convert from minutes to ns
        instrumentId: id,
        timestamp: 1e6 * Number(datum.x) // Influx time is in ns, not ms
    }
});

export default influxDataPersistence;
