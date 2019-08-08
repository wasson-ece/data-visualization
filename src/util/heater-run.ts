import HeaterState from '../interfaces/HeaterState';
import Run from '../interfaces/Run';
import { tiClient } from '../ti-communication/ti';
import Command from 'node-ti/build/enums/command';

export const findActiveRun = (heater: HeaterState) => heater.runs.find(r => r.isRunning);

const PID_TUNE_TOLERANCE = 0.1;
const SETPOINT_TOLERANCE = 0.1;

export const areHeaterParamsWithinTolerance = (heater: HeaterState, run: Run) =>
    isKpWithinTolerance(heater, run) &&
    isKiWithinTolerance(heater, run) &&
    isKdWithinTolerance(heater, run) &&
    isSetpointWithinTolerance(heater, run);

const isKpWithinTolerance = (heater: HeaterState, run: Run): boolean =>
    Math.abs(heater.kp - Number(run.kp)) < PID_TUNE_TOLERANCE;

const isKiWithinTolerance = (heater: HeaterState, run: Run): boolean =>
    Math.abs(heater.ki - Number(run.ki)) < PID_TUNE_TOLERANCE;

const isKdWithinTolerance = (heater: HeaterState, run: Run): boolean =>
    Math.abs(heater.ki - Number(run.ki)) < PID_TUNE_TOLERANCE;

const isSetpointWithinTolerance = (heater: HeaterState, run: Run): boolean => {
    if (run.isEquilibrating)
        return Math.abs(heater.setpoint - Number(run.baseline)) < SETPOINT_TOLERANCE;
    if (run.isHoldingSetpoint)
        return Math.abs(heater.setpoint - Number(run.setpoint)) < SETPOINT_TOLERANCE;
    return true;
};

export const reconcileHeaterRunParams = (heater: HeaterState, run: Run) => {
    if (!isKpWithinTolerance(heater, run)) {
        console.log(`For heater ${heater.id} we must adjust kp from ${heater.kp} to ${run.kp}`);
        tiClient.sendPIDParameter(Number(heater.id), Command.SetPVal, Number(run.kp));
    }
    if (!isKiWithinTolerance(heater, run)) {
        console.log(`For heater ${heater.id} we must adjust ki from ${heater.ki} to ${run.ki}`);
        tiClient.sendPIDParameter(Number(heater.id), Command.SetIVal, Number(run.ki));
    }
    if (!isKdWithinTolerance(heater, run)) {
        console.log(`For heater ${heater.id} we must adjust kd from ${heater.kd} to ${run.kd}`);
        tiClient.sendPIDParameter(Number(heater.id), Command.SetDVal, Number(run.kd));
    }
    if (!isSetpointWithinTolerance(heater, run)) {
        console.log(
            `For heater ${heater.id} we must adjust setpoint from ${heater.setpoint} to ${
                run.isEquilibrating ? run.baseline : run.setpoint
            }`
        );
        if (run.isEquilibrating) {
            console.log(`sending equil ${run.baseline}`);
            tiClient.sendSetpoint(Number(heater.id), Number(run.baseline));
        }
        if (run.isHoldingSetpoint) tiClient.sendSetpoint(Number(heater.id), Number(run.setpoint));
    }
};
