import { Action } from '@ngrx/store';

export const actionTypes = {
    ADD_CARD: 'ADD_CARD',
    ADD_CARD_SUCCESS: 'ADD_CARD_SUCCESS',
    DELETE_CARD: 'DELETE_CARD',
    DELETE_CARD_SUCCESS: 'DELETE_CARD_SUCCESS',
    DEFAULT_CARD: 'DEFAULT_CARD',
    DEFAULT_CARD_SUCCESS: 'DEFAULT_CARD_SUCCESS',
    UPDATE_CARD: 'UPDATE_CARD',
    UPDATE_CARD_SUCCESS: 'UPDATE_CARD_SUCCESS',
    CHANGE_PAYMENT_METHOD:'CHANGE_PAYMENT_METHOD',
    CHANGE_PAYMENT_METHOD_SUCCESS:'CHANGE_PAYMENT_METHOD_SUCCESS'

    
};

type credentials = {};

export class ChangePayment implements Action {
    type = actionTypes.CHANGE_PAYMENT_METHOD;
    constructor(public payload: credentials) { }
};
export class ChangePaymentSuccess implements Action {
    type = actionTypes.CHANGE_PAYMENT_METHOD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class AppAddCard implements Action {
    type = actionTypes.ADD_CARD;
    constructor(public payload: credentials) { }
};
export class AppAddCardSuccess implements Action {
    type = actionTypes.ADD_CARD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class AppDeleteCard implements Action {
    type = actionTypes.DELETE_CARD;
    constructor(public payload: credentials) { }
};
export class AppDeleteCardSuccess implements Action {
    type = actionTypes.DELETE_CARD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class AppDefaultCard implements Action {
    type = actionTypes.DEFAULT_CARD;
    constructor(public payload: credentials) { }
};
export class AppDefaultCardSuccess implements Action {
    type = actionTypes.DEFAULT_CARD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class AppUpdateCard implements Action {
    type = actionTypes.UPDATE_CARD;
    constructor(public payload: credentials) { }
};
export class AppUpdateCardSuccess implements Action {
    type = actionTypes.UPDATE_CARD_SUCCESS;
    constructor(public payload: credentials) { }
};



export type Actions
= AppAddCard | AppAddCardSuccess | AppDeleteCard | AppDeleteCardSuccess | AppDefaultCard |AppDefaultCardSuccess | AppUpdateCard |AppUpdateCardSuccess;
