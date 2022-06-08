import { Action } from '@ngrx/store';

export const actionTypes = {
    SELECT_ADD_CARD: 'SELECT_ADD_CARD',
    SELECT_ADD_CARD_SUCCESS: 'SELECT_ADD_CARD_SUCCESS',
    SELECT_DELETE_CARD: 'SELECT_DELETE_CARD',
    SELECT_DELETE_CARD_SUCCESS: 'SELECT_DELETE_CARD_SUCCESS',
    SELECT_DEFAULT_CARD: 'SELECT_DEFAULT_CARD',
    SELECT_DEFAULT_CARD_SUCCESS: 'SELECT_DEFAULT_CARD_SUCCESS',
    SELECT_UPDATE_CARD: 'SELECT_UPDATE_CARD',
    SELECT_UPDATE_CARD_SUCCESS: 'SELECT_UPDATE_CARD_SUCCESS',
    APPLY_PROMOCODE:'APPLY_PROMOCODE',
    APPLY_PROMOCODE_SUCCESS:'APPLY_PROMOCODE_SUCCESS',
    DESTROY_VALUES:'DESTROY_VALUES',
    APPLY_PROMOCODE_ERROR:'APPLY_PROMOCODE_ERROR'

    
};

type credentials = {};

export class SelectAppAddCard implements Action {
    type = actionTypes.SELECT_ADD_CARD;
    constructor(public payload: credentials) { }
};
export class PromoEror implements Action {
    type = actionTypes.APPLY_PROMOCODE_ERROR;
    constructor(public payload: credentials) { }
};
export class DestroyValues implements Action {
    type = actionTypes.DESTROY_VALUES;
    constructor(public payload: credentials) { }
};
export class SelectAppAddCardSuccess implements Action {
    type = actionTypes.SELECT_ADD_CARD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class SelectAppDeleteCard implements Action {
    type = actionTypes.SELECT_DELETE_CARD;
    constructor(public payload: credentials) { }
};
export class SelectAppDeleteCardSuccess implements Action {
    type = actionTypes.SELECT_DELETE_CARD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class SelectAppDefaultCard implements Action {
    type = actionTypes.SELECT_DEFAULT_CARD;
    constructor(public payload: credentials) { }
};
export class SelectAppDefaultCardSuccess implements Action {
    type = actionTypes.SELECT_DEFAULT_CARD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class SelectAppUpdateCard implements Action {
    type = actionTypes.SELECT_UPDATE_CARD;
    constructor(public payload: credentials) { }
};
export class SelectAppUpdateCardSuccess implements Action {
    type = actionTypes.SELECT_UPDATE_CARD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class ApplyPromoCode implements Action {
    type = actionTypes.APPLY_PROMOCODE;
    constructor(public payload: credentials) { }
};
export class ApplyPromoCodeSuccess implements Action {
    type = actionTypes.APPLY_PROMOCODE_SUCCESS;
    constructor(public payload: credentials) { }
};


export type Actions
= SelectAppAddCard | SelectAppAddCardSuccess | SelectAppDeleteCard |ApplyPromoCodeSuccess | SelectAppDeleteCardSuccess | ApplyPromoCode |SelectAppDefaultCard |SelectAppDefaultCardSuccess | SelectAppUpdateCard |SelectAppUpdateCardSuccess;
