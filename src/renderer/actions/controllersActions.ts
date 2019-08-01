import { Action, ActionCreator } from 'redux';
import ControllerType from '../../enums/ControllerType';
import Controller from '../../types/Controller';
import { Point } from 'electron';

export interface AddController extends Action {
    type: 'ADD_CONTROLLER';
    controllerType: ControllerType;
    controller: Controller;
}

export interface SetControllers extends Action {
    type: 'SET_CONTROLLERS';
    controllerType: ControllerType;
    controllers: Controller[];
}

export interface UpdateControllers extends Action {
    type: 'UPDATE_CONTROLLERS';
    controllerType: ControllerType;
    controllers: Controller[];
}

export interface AddHeaterDatum extends Action {
    type: 'ADD_HEATER_DATUM';
    id: string;
    datum: Point;
}

export interface ClearHeaterData extends Action {
    type: 'CLEAR_HEATER_DATA';
    id: string;
}

export interface RemoveController extends Action {
    type: 'REMOVE_CONTROLLER';
    controllerType: ControllerType;
    id: string;
}

export interface SetControllerAttribute extends Action {
    type: 'SET_CONTROLLER_ATTRIBUTE';
    controllerType: ControllerType;
    attribute: string;
    value: any;
}

export const addController: ActionCreator<AddController> = (
    controllerType: ControllerType,
    controller: Controller
) => ({
    type: 'ADD_CONTROLLER',
    controllerType,
    controller
});

export const updateControllers: ActionCreator<UpdateControllers> = (
    controllerType: ControllerType,
    controllers: Controller[]
) => ({
    type: 'UPDATE_CONTROLLERS',
    controllerType,
    controllers
});

export const addHeaterDatum: ActionCreator<AddHeaterDatum> = (id: string, datum: Point) => ({
    type: 'ADD_HEATER_DATUM',
    id,
    datum
});

export const clearHeaterData: ActionCreator<ClearHeaterData> = (ovenId: string) => ({
    type: 'CLEAR_HEATER_DATA',
    id: ovenId
});

export const setControllerAttribute: ActionCreator<RemoveController> = (
    controllerType: ControllerType,
    id: string,
    attribute: string,
    value
) => ({
    type: 'REMOVE_CONTROLLER',
    controllerType,
    attribute,
    value,
    id
});

export const removeController: ActionCreator<RemoveController> = (
    controllerType: ControllerType,
    id: string
) => ({
    type: 'REMOVE_CONTROLLER',
    controllerType,
    id
});

export type ControllersAction =
    | AddController
    | RemoveController
    | SetControllerAttribute
    | UpdateControllers
    | SetControllers
    | AddHeaterDatum
    | ClearHeaterData;
