import { Action, ActionCreator } from 'redux';
import Controller from '../../ti-components/controllers/Controller';
import ControllerType from '../../enums/ControllerType';

export interface AddController extends Action {
    type: 'ADD_CONTROLLER';
    detectorType: ControllerType;
    detector: Controller;
}

export interface RemoveController extends Action {
    type: 'REMOVE_CONTROLLER';
    detectorType: ControllerType;
    id: string;
}

export interface SetControllerAttribute extends Action {
    type: 'SET_CONTROLLER_ATTRIBUTE';
    detectorType: ControllerType;
    attribute: string;
    value: any;
}

export const addController: ActionCreator<AddController> = (
    detectorType: ControllerType,
    detector: Controller
) => ({
    type: 'ADD_CONTROLLER',
    detectorType,
    detector
});

export const setControllerAttribute: ActionCreator<RemoveController> = (
    detectorType: ControllerType,
    id: string,
    attribute: string,
    value
) => ({
    type: 'REMOVE_CONTROLLER',
    detectorType,
    attribute,
    value,
    id
});

export const removeController: ActionCreator<RemoveController> = (
    detectorType: ControllerType,
    id: string
) => ({
    type: 'REMOVE_CONTROLLER',
    detectorType,
    id
});

export type ControllersAction = AddController | RemoveController | SetControllerAttribute;
