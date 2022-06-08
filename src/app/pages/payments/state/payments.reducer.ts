import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {

};

export const Payments: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {

        case 'ADD_CARD':
            return Object.assign({});

        case 'ADD_CARD_SUCCESS':
            return Object.assign({}, state, { addCardSuccess: action.payload });

        case 'DELETE_CARD':
            return Object.assign({});

        case 'DELETE_CARD_SUCCESS':
            return Object.assign({}, state, { deleteCardSuccess: action.payload });

        case 'DEFAULT_CARD':
            return Object.assign({});

        case 'DEFAULT_CARD_SUCCESS':
            return Object.assign({}, state, { defaultCardSuccess: action.payload });

        case 'UPDATE_CARD':
            return Object.assign({});

        case 'UPDATE_CARD_SUCCESS':
            return Object.assign({}, state, { updateCardSuccess: action.payload });

        default:
            return state;
    }
};
