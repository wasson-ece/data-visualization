import * as Influx from 'influx';
import { PersistenceFunction } from '../middleware/persist-data';
import Run from '../interfaces/Run';
import HeaterDatum from '../interfaces/HeaterDatum';

const influxEnv = {
    host: 'influx.wasson.tech',
    port: '8086',
    database: 'eclipse_pid',
    username: 'admin',
    password: 'g7VOHIkrOT'
};

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
        setpoint: run.setpoint,
        actual: datum.y,
        kp: run.kp,
        ki: run.ki,
        kd: run.kd,
        setpointHoldTime: run.setpointHoldTime,
        instrumentId: id,
        timestamp: 1e6 * datum.x // Influx time is in ns, not ms
    }
});

export default influxDataPersistence;
