import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {
  
  
};

export const disputes: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'GET_ALL_DISPUTES_SUCCESS':
        return Object.assign({}, state,  {allDisputes:action.payload} );
        case 'GET_DISPUTE_BY_ID_SUCCESS':
        return Object.assign({}, state,  {disputeById:action.payload} );
        case 'GET_ALL_DISPUTES_COUNT_SUCCESS':
        return Object.assign({}, state,  {disputeCount:action.payload} );
        default:
            return state;
    }
};
