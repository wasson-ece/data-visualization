export default interface Run {
    kp?: string;
    ki?: string;
    kd?: string;
    baseline?: string;
    setpoint?: string;
    equilibrationTime?: string;
    setpointHoldTime?: string;
    uuid: string;
    isFinished: boolean;
}
