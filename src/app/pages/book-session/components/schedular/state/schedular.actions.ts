import { Action } from '@ngrx/store';

export const actionTypes = {
    SET_AVAILABILTY: 'SET_AVAILABILTY',
    SET_AVAILABILTY_SUCCESS: 'SET_AVAILABILTY_SUCCESS',
    // GOTO_BOOK_SESSION_STEP3:'GOTO_BOOK_SESSION_STEP3',
    // GOTO_BOOK_SESSION_STEP3_SUCCESS:'GOTO_BOOK_SESSION_STEP3_SUCCESS',
    
};

type credentials = {};

export class AppSetAvailabilty implements Action {
    type = actionTypes.SET_AVAILABILTY;
    constructor(public payload: credentials) { }
};
export class AppSetAvailabiltySuccess implements Action {
    type = actionTypes.SET_AVAILABILTY_SUCCESS;
    constructor(public payload: credentials) { }
};
// export class GoToStep3 implements Action {
//     type = actionTypes.GOTO_BOOK_SESSION_STEP3;
//     constructor(public payload: any = {}) { }
// }
// export class GoToStep3Success implements Action {
//     type = actionTypes.GOTO_BOOK_SESSION_STEP3_SUCCESS;
//     constructor(public payload: any = {}) { }
// }


export type Actions
= AppSetAvailabilty;
