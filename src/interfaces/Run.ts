import { Point } from 'electron';

export default interface Run {
    uuid: string;
    kp?: string;
    ki?: string;
    kd?: string;
    baseline?: string;
    setpoint?: string;
    equilibrationTime?: string;
    setpointHoldTime?: string;
    startTime: number;
    isFinished: boolean;
}
