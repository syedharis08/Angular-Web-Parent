
import { Action } from '@ngrx/store';

export const actionTypes = {
    APP_SETTING_ADD: 'APP_SETTING_ADD',
    APP_REDIRECT_DASHBOARD: 'APP_REDIRECT_DASHBOARD',
    APP_REDIRECT_LOGIN: 'APP_REDIRECT_LOGIN',
    APP_REDIRECT_ROUTER: 'APP_REDIRECT_ROUTER',
    APP_AUTHENTICATION_FAIL: 'APP_AUTHENTICATION_FAIL',
    APP_SIDE_BAR: 'APP_SIDE_BAR',
    APP_ACTIVE_MENU_ITEM: 'APP_ACTIVE_MENU_ITEM',
    APP_INTERNET_NOT_WORKING: 'APP_INTERNET_NOT_WORKING'
};

type credentials = {

};

export class AppAddSettingAction implements Action {
    type = actionTypes.APP_SETTING_ADD;
    constructor() { }
}

export class AppRedirectDashboardAction implements Action {
    type = actionTypes.APP_REDIRECT_DASHBOARD;
    constructor() { }
}

export class AppRedirectLoginAction implements Action {
    type = actionTypes.APP_REDIRECT_LOGIN;
    constructor() { }
}

export class AppRedirectRouterAction implements Action {
    type = actionTypes.APP_REDIRECT_ROUTER;
    constructor() { }
}


export class AppAuthenticationFail implements Action {
    type = actionTypes.APP_AUTHENTICATION_FAIL;
    constructor(public payload: credentials) { }
}


export class AppSideBar implements Action {
    type = actionTypes.APP_SIDE_BAR;
    constructor(public payload: credentials) { }
}

export class AppMenuItem implements Action {
    type = actionTypes.APP_ACTIVE_MENU_ITEM;
    constructor(public payload: credentials) { }
}

export class AppInternetNotWorking implements Action {
    type = actionTypes.APP_INTERNET_NOT_WORKING;
    constructor(public payload: any) { }
}

export type Actions
    = AppAddSettingAction
    | AppRedirectDashboardAction
    | AppRedirectLoginAction
    | AppRedirectRouterAction
    | AppAuthenticationFail
    | AppInternetNotWorking
    | AppMenuItem
    | AppSideBar;


