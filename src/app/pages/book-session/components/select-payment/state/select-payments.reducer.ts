import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {
    valid: false,
};

export const selectPayments: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {

        case 'SELECT_ADD_CARD':
            return Object.assign({});

        case 'SELECT_ADD_CARD_SUCCESS':
            return Object.assign({}, state, {addCardSuccess: action.payload});

        case 'SELECT_DELETE_CARD':
            return Object.assign({});

        case 'SELECT_DELETE_CARD_SUCCESS':
            return Object.assign({}, state, {deleteCardSuccess: action.payload});

        case 'SELECT_DEFAULT_CARD':
            return Object.assign({});

        case 'SELECT_DEFAULT_CARD_SUCCESS':
            return Object.assign({}, state, {defaultCardSuccess: action.payload});

        case 'SELECT_UPDATE_CARD':
            return Object.assign({});
        case 'APPLY_PROMOCODE_ERROR':
            return Object.assign({}, state, {promoCodeValue: action.payload, valid: false});
        case 'SELECT_UPDATE_CARD_SUCCESS':
            return Object.assign({}, state, {updateCardSuccess: action.payload});

        case 'APPLY_PROMOCODE_SUCCESS':
            return Object.assign({}, state, {promoCodeValue: action.payload, valid: true});
        case 'DESTROY_VALUES':
            return Object.assign({}, state, {promoCodeValue: 0});

        default:
            return state;
    }
};
