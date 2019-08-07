import Run from '../interfaces/Run';

export const isDoneEquilibrating = (run: Run): boolean =>
    run.isEquilibrating && elapsedMinutesSince(run.startTime) >= Number(run.equilibrationTime);

export const isDoneHoldingSetpoint = (run: Run): boolean =>
    run.isHoldingSetpoint &&
    elapsedMinutesSince(run.startTime) >=
        Number(run.equilibrationTime) + Number(run.setpointHoldTime);

export const isReadyToStartRun = (run: Run): boolean =>
    run.isRunning && !run.isEquilibrating && !run.isHoldingSetpoint && !run.isFinished;

export const elapsedMinutesSince = (startTime: number) => (Date.now() - startTime) / (60 * 1000);

export const remainingMinutes = (startTimeInMs: number, totalRunTimeMinutes: number): number =>
    totalRunTimeMinutes - elapsedMinutesSince(startTimeInMs);

export const minutesToString = (timeInMinutes: number): string => {
    const minutes = Math.trunc(timeInMinutes);
    const seconds = Math.floor(60 * (timeInMinutes - minutes));

    if (minutes <= 0) return `${seconds} seconds`;
    if (minutes > 0 && seconds <= 0) return `${minutes} minutes`;
    return `${minutes} minutes, ${seconds} seconds`;
};
