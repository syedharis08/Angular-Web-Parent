import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../services';

import * as notification from './notification.actions';

@Injectable()
export class NotificationEffects {

    constructor(private actions$: Actions, private store: Store<any>, private notificationService: NotificationService
    ) {
    }

    @Effect({dispatch: false})
    getAllNotifications$ = this.actions$
        .ofType('GET_ALL_NOTIFICATION')
        .do((action) => {
            this.notificationService.getAllNotifications(action.payload).subscribe((result) => {

                    if (result.message == 'Success') {

                        let notificationType = (action.payload.type) ? action.payload.currentPage.type : 'all';
                        // creating state payload for next action
                        let payload = {
                            notifications: result.data.notification,
                            count: result.data.count,
                            currentPage: action.payload.currentPage,
                            limit: action.payload.limit,
                            unreadNotificationCount: result.data.unreadNotificationCount,
                            type: notificationType
                        };

                        this.store.dispatch(new notification.GetAllNotificationSuccessAction(payload));
                    }
                }, (error) => {
                }
            );
        });

    @Effect({dispatch: false})
    getAllNotificationsSuccess: Observable<Action> = this.actions$
        .ofType('GET_ALL_NOTIFICATION_SUCCESS')
        .do((action) => {
        });

    @Effect({dispatch: false})
    readNotification: Observable<any> = this.actions$
        .ofType('READ_NOTIFICATION')
        .withLatestFrom(this.store)
        //todo fix here maping value exectly
        //.map(([action, state]) => state.booking)
        .do((storeState) => {
            let action = storeState[0];
            let state = storeState[1];
            this.notificationService.readNotification(action.payload).subscribe((result) => {

                    if (result.message == 'Success') {
                        let index = state.notification.notifications.indexOf(action.payload);
                        action.payload.isRead = true;
                        state.notification.notifications[index] = action.payload;
                        state.notification.unreadNotificationCount -= 1;
                        this.store.dispatch({type: notification.actionTypes.READ_NOTIFICATION_SUCCESS, payload: state.notification});
                    }
                }
                , (error) => {
                }
            );
        });

    @Effect({dispatch: false})
    pushNotificationsSuccess: Observable<Action> = this.actions$
        .ofType('PUSH_NOTIFICATION')
        .do((action) => {
        });

}


