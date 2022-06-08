import { Action } from '@ngrx/store';

export const actionTypes = {

    // GET_ALL_NOTIFICATION: 'GET_ALL_NOTIFICATION',
    GET_ALL_NOTIFICATION_SUCCESS: 'GET_ALL_NOTIFICATION_SUCCESS',
    GET_ALL_NOTIFICATIONS: 'GET_ALL_NOTIFICATIONS',
    // GET_ALL_NOTIFICATIONS_SUCCESS: 'GET_ALL_NOTIFICATIONS_SUCCESS',
    READ_NOTIFICATION: 'READ_NOTIFICATION',
    READ_NOTIFICATION_SUCCESS: 'READ_NOTIFICATION_SUCCESS',
    CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
    CLEAR_NOTIFICATION_SUCCESS: 'CLEAR_NOTIFICATION_SUCCESS',
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    PUSH_NOTIFICATION_SUCCESS: 'PUSH_NOTIFICATION_SUCCESS',
    SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
    SHOW_NOTIFICATION_SUCCESS: 'SHOW_NOTIFICATION_SUCCESS',
    ACCEPT_INVITATION: 'ACCEPT_INVITATION',
    ACCEPT_INVITATION_SUCCESS: 'ACCEPT_INVITATION_SUCCESS',
    POPUP_BOOKING_ACCEPTED: 'POPUP_BOOKING_ACCEPTED',
    GET_NOTIFICATION_BY_ID:'GET_NOTIFICATION_BY_ID',
    GET_NOTIFICATION_BY_ID_SUCCESS:'GET_NOTIFICATION_BY_ID_SUCCESS',
    POPUP_BOOKING_CANCELLED_BY_TUTOR: 'POPUP_BOOKING_CANCELLED_BY_TUTOR',
    POPUP_RESCHEDULE_REQUEST: 'POPUP_RESCHEDULE_REQUEST',
    ACCEPT_RESCHEDULE_REQUEST: 'ACCEPT_RESCHEDULE_REQUEST',
    ACCEPT_RESCHEDULE_REQUEST_SUCCESS: 'ACCEPT_RESCHEDULE_REQUEST_SUCCESS',
    POPUP_BOOKING_REJECTED: 'POPUP_BOOKING_REJECTED',
    COMMON_NOTIFICATION_POPUP: 'COMMON_NOTIFICATION_POPUP',
    POPUP_RATING: 'POPUP_RATING',
    SEE_ALL_NOTIFICATION:'SEE_ALL_NOTIFICATION',
    SEE_ALL_NOTIFICATION_SUCCESS:'SEE_ALL_NOTIFICATION_SUCCESS'
};

// export class GetAllNotificationAction implements Action {
//     type = actionTypes.GET_ALL_NOTIFICATION;
//     constructor(public payload: any) { }
// }
export class SeeAllNotification implements Action {
    type = actionTypes.SEE_ALL_NOTIFICATION;
    constructor(public payload: any) { }
}
export class SeeAllNotificationSuccess implements Action {
    type = actionTypes.SEE_ALL_NOTIFICATION_SUCCESS;
    constructor(public payload: any) { }
}
export class PopupBookingAccepted implements Action {
    type = actionTypes.POPUP_BOOKING_ACCEPTED;
    constructor(public payload: any) { }
}
export class RatingPopup implements Action {
    type = actionTypes.POPUP_RATING;
    constructor(public payload: any) { }
}
export class CommonNotificationPopup implements Action {
    type = actionTypes.COMMON_NOTIFICATION_POPUP;
    constructor(public payload: any) { }
}
export class PopupBookingRejected implements Action {
    type = actionTypes.POPUP_BOOKING_REJECTED;
    constructor(public payload: any) { }
}
export class AcceptRescheduleRequest implements Action {
    type = actionTypes.ACCEPT_RESCHEDULE_REQUEST;
    constructor(public payload: any) { }
}
export class AcceptRescheduleRequestSuccess implements Action {
    type = actionTypes.ACCEPT_RESCHEDULE_REQUEST_SUCCESS;
    constructor(public payload: any) { }
}
export class PopupRescheduleByTutor implements Action {
    type = actionTypes.POPUP_RESCHEDULE_REQUEST;
    constructor(public payload: any) { }
}
export class PopupBookingCancelledByTutor implements Action {
    type = actionTypes.POPUP_BOOKING_CANCELLED_BY_TUTOR;
    constructor(public payload: any) { }
}
export class GetAllNotificationSuccessAction implements Action {
    type = actionTypes.GET_ALL_NOTIFICATION_SUCCESS;
    constructor(public payload: any) { }
}

export class GetAllNotificationsAction implements Action {
    type = actionTypes.GET_ALL_NOTIFICATIONS;
    constructor(public payload: any) { }
}

// export class GetAllNotificationsSuccessAction implements Action {
//     type = actionTypes.GET_ALL_NOTIFICATIONS_SUCCESS;
//     constructor(public payload: any) { }
// }

export class ReadNotificationAction implements Action {
    type = actionTypes.READ_NOTIFICATION;
    constructor(public payload: any) { }
}

export class ReadNotificationSuccessAction implements Action {
    type = actionTypes.READ_NOTIFICATION_SUCCESS;
    constructor(public payload: any) { }
}

export class ClearNotificationSuccessAction implements Action {
    type = actionTypes.CLEAR_NOTIFICATION_SUCCESS;
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

export class ShowNotificationAction implements Action {
    type = actionTypes.SHOW_NOTIFICATION;
    constructor(public payload: any) { }
}

export class ShowNotificationSuccessAction implements Action {
    type = actionTypes.SHOW_NOTIFICATION_SUCCESS;
    constructor(public payload: any) { }
}

export class AcceptInvitationSuccessAction implements Action {
    type = actionTypes.ACCEPT_INVITATION_SUCCESS;
    constructor(public payload: any) { }
}

export type Actions =
    // = GetAllNotificationAction
    | GetAllNotificationSuccessAction
    | PopupRescheduleByTutor
    | ReadNotificationAction
    | ReadNotificationSuccessAction
    | PushNotificationAction
    | PushNotificationSuccessAction
    | ShowNotificationAction
    | ShowNotificationSuccessAction
    | AcceptInvitationSuccessAction
    | PopupBookingCancelledByTutor
    | CommonNotificationPopup
    | PopupBookingRejected
    | RatingPopup
    | AcceptRescheduleRequestSuccess
    | PopupBookingAccepted;
