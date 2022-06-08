import { Action } from '@ngrx/store';

export const actionTypes = {
    AUTH_LOGGED_IN: 'AUTH_LOGGED_IN',
    AUTH_LOGOUT: 'AUTH_LOGOUT',
    AUTH_LOGOUT_SUCCESS: 'AUTH_LOGOUT_SUCCESS',
    LOGGED_OUT_USER:'LOGGED_OUT_USER',
    LOGGED_OUT_USER_SUCCESS:'LOGGED_OUT_USER_SUCCESS',
    JUST_LOGOUT:'JUST_LOGOUT',
    JUST_LOGOUT_SUCCESS:'JUST_LOGOUT_SUCCESS'

};

type credentials = {
    emailOrPhone: string,
    password: string,
    deviceType: string
};
export class JustLogout implements Action {
    type = actionTypes.JUST_LOGOUT;
    constructor(public payload: any = {}) { }
}
export class JustLogoutSuccess implements Action {
    type = actionTypes.JUST_LOGOUT_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class AuthLogoutAction implements Action {
    type = actionTypes.AUTH_LOGOUT;
    constructor(public payload: any = {}) { }
}
export class AuthLoggedSuccessAction implements Action {
    type = actionTypes.LOGGED_OUT_USER_SUCCESS;
    constructor(public payload: any = {}) { }
}



export class AuthLoggedInAction implements Action {
    type = actionTypes.AUTH_LOGGED_IN;
    constructor(public payload: any = {}) { }
}


export class AuthLoggedOutUser implements Action {
    type = actionTypes.LOGGED_OUT_USER;
    constructor(public payload: any = {}) { }
}

export class AuthLogoutSuccessAction implements Action {
    type = actionTypes.AUTH_LOGOUT_SUCCESS;
    constructor(public payload: any = {}) { }
}


export type Actions
    = |AuthLogoutAction
    | AuthLogoutAction;
