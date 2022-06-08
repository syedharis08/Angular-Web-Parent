import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {};

export const reports: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'GET_ALL_REPORTS_SUCCESS':
            return Object.assign({}, state, {reports: action.payload});
        case 'GET_ALL_REPORTS_COUNT_SUCCESS':
            return Object.assign({}, state, {reportsCount: action.payload});
        default:
            return state;
    }
};
