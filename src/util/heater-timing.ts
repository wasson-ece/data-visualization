import Run from '../interfaces/Run';

export const isDoneEquilibrating = (run: Run): boolean =>
    run.isEquilibrating && elapsedMinutesSince(run.startTime) >= Number(run.equilibrationTime);

export const isDoneHoldingSetpoint = (run: Run): boolean =>
    run.isHoldingSetpoint &&
    elapsedMinutesSince(run.startTime) >=
        Number(run.equilibrationTime) + Number(run.setpointHoldTime);

export const isReadyToStartRun = (run: Run): boolean =>
    run.isRunning && !run.isEquilibrating && !run.isHoldingSetpoint && !run.isFinished;

export const elapsedMinutesSince = (startTime: number) => {
    let time = (Date.now() - startTime) / (60 * 1000);
    console.log(time);
    return time;
};
