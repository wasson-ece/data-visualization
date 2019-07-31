export default interface Run {
    kp?: number;
    ki?: number;
    kd?: number;
    baseline?: number;
    setpoint?: number;
    equilibrationTime?: number;
    setpointHoldTime?: number;
}
