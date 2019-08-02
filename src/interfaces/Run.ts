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
    isRunning: boolean;
    isEquilibrating: boolean;
    isHoldingSetpoint: boolean;
}
