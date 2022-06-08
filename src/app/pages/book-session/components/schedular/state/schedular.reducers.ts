import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {
    mySchedule : null,
    setAvailabilySuccess: null
};

export const schedular: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {

        case 'SET_AVAILABILTY':
            return Object.assign({}, state);

            case 'SET_AVAILABILTY_SUCCESS':
            return Object.assign({}, state ,{ setAvailabilySuccess: action.payload});
            // case 'GOTO_BOOK_SESSION_STEP3_SUCCESS':
            // return Object.assign({}, state ,{ step2Data: action.payload,step3:true});

        default:
            return state;
    }
};
