import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {

    notifications: null,
    count: 0,
    currentPage: 0,
    limit: 0,
    activeNotification: null,
    unreadNotificationCount: 0
};


export const notification: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {

        case 'GET_ALL_NOTIFICATION':
            return Object.assign({}, state);
        case 'GET_ALL_NOTIFICATION_SUCCESS':
            return Object.assign({}, action.payload);
        case 'READ_NOTIFICATION':
            return Object.assign({}, state, { activeNotification: action.payload });
        case 'READ_NOTIFICATION_SUCCESS':
            return Object.assign({}, action.payload);
        case 'PUSH_NOTIFICATION':
            return Object.assign({}, state, {
                notifications: action.payload.notifications,
                unreadNotificationCount: action.payload.unreadNotificationCount
            });
        case 'PUSH_NOTIFICATION_SUCCESS':
            return Object.assign({}, action.payload);
        default:
            return state;
    }
};
