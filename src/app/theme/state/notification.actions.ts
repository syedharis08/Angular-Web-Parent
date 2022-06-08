import { Action } from '@ngrx/store';

export const actionTypes = {

    GET_ALL_NOTIFICATION: 'GET_ALL_NOTIFICATION',
    GET_ALL_NOTIFICATION_SUCCESS: 'GET_ALL_NOTIFICATION_SUCCESS',
    READ_NOTIFICATION: 'READ_NOTIFICATION',
    READ_NOTIFICATION_SUCCESS: 'READ_NOTIFICATION_SUCCESS',
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    PUSH_NOTIFICATION_SUCCESS: 'PUSH_NOTIFICATION_SUCCESS',
};



export class GetAllNotificationAction implements Action {
    type = actionTypes.GET_ALL_NOTIFICATION;
    constructor(public payload: any) { }
}

export class GetAllNotificationSuccessAction implements Action {
    type = actionTypes.GET_ALL_NOTIFICATION_SUCCESS;
    constructor(public payload: any) { }
}


export class ReadNotificationAction implements Action {
    type = actionTypes.READ_NOTIFICATION;
    constructor(public payload: any) { }
}

export class ReadNotificationSuccessAction implements Action {
    type = actionTypes.READ_NOTIFICATION_SUCCESS;
    constructor(public payload: any) { }
}



export class PushNotificationAction implements Action {
    type = actionTypes.PUSH_NOTIFICATION;
    constructor(public payload: any) { }
}
export class PushNotificationSuccessAction implements Action {
    type = actionTypes.PUSH_NOTIFICATION_SUCCESS;
    constructor(public payload: any) { }
}

export type Actions
    = GetAllNotificationAction
    | GetAllNotificationSuccessAction
    | ReadNotificationAction
    | ReadNotificationSuccessAction
    | PushNotificationAction
    | PushNotificationSuccessAction;

