import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {
    currentUser: null,
    tutors: null,
    loggedIn: false,
    tutorcountSuccess: false,
    latLongResult: null,
    checkTutor:false

};

export const auth: ActionReducer<any> = (state = initialState, action: Action) => {

    switch (action.type) {
        case 'AUTH_LOGGED_IN':

            return Object.assign({}, state, { loggedIn: true });
        case 'AUTH_LOGOUT_SUCCESS':
            return Object.assign({}, state, { currentUser: null, loggedIn: false });
        case 'AUTH_LOGOUT':
            return Object.assign({}, state, { currentUser: null, loggedIn: false });
        case 'LOGGED_OUT_USER_SUCCESS':
            return Object.assign({}, state, { currentUser: null, loggedIn: false ,checkTutor:true});

        default:
            return state;
    }
};
