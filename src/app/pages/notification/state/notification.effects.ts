import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification';
import { BaThemeSpinner } from '../../../theme/services';
import * as notification from './notification.actions';
import { BookingAccepted } from '../components/booking-accept-popup';
import { BookingCancelled } from '../components/booking-cancelled-popup';
import { BookingReschedule } from '../components/booking-reschedule-popup/booking-reschedule-popup.component';
import { BookingRejected } from '../components/booking-rejected-popup/booking-rejected-popup.component';
import { CommonNotificationPopup } from '../components/common-notification-popup/common-notification-popup';
import { RatingPopupDialog } from '../components/rating-popup/rating-popup.component';
import { MatDialog } from '@angular/material';
import * as auth from '../../../auth/state/auth.actions';
import { CommonErrorDialog } from '../../../auth/model/common-error-dialog/common-error-dialog';

@Injectable()
export class NotificationEffects {
    notificationData;

    constructor(private actions$: Actions, private store: Store<any>, private activatedRoute: ActivatedRoute,
                private notificationService: NotificationService, private _spinner: BaThemeSpinner, private datePipe: DatePipe,
                private router: Router, private dialog: MatDialog) {
    }

    @Effect({dispatch: false})
    getAllNotificationsSuccess: Observable<Action> = this.actions$
        .ofType('GET_ALL_NOTIFICATION_SUCCESS')
        .do((action) => {

        });
    @Effect({dispatch: false})
    popupBookingAccepted: Observable<Action> = this.actions$
        .ofType('POPUP_BOOKING_ACCEPTED')
        .do((action) => {
            let dialogRef = this.dialog.open(BookingAccepted, {
                data: action.payload
            });
        });
    @Effect({dispatch: false})
    popupBookingRejected: Observable<Action> = this.actions$
        .ofType('POPUP_BOOKING_REJECTED')
        .do((action) => {
            let dialogRef = this.dialog.open(BookingRejected, {
                data: action.payload
            });
        });
    @Effect({dispatch: false})
    popupBookingCancelledByTutor: Observable<Action> = this.actions$
        .ofType('POPUP_BOOKING_CANCELLED_BY_TUTOR')
        .do((action) => {
            let dialogRef = this.dialog.open(BookingCancelled, {
                data: action.payload
            });
        });
    @Effect({dispatch: false})
    rescheduleByTutor: Observable<Action> = this.actions$
        .ofType('POPUP_RESCHEDULE_REQUEST')
        .do((action) => {
            let dialogRef = this.dialog.open(BookingReschedule, {
                data: action.payload
            });
        });

    @Effect({dispatch: false})
    notificationById$ = this.actions$
        .ofType('GET_NOTIFICATION_BY_ID')
        .do((action) => {
            this._spinner.show();
            this.notificationService.getNotificationById(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200) {
                        this.store.dispatch({type: notification.actionTypes.GET_NOTIFICATION_BY_ID_SUCCESS, payload: result});

                    } else {
                    }
                }
                , (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message) {
                        this.dialog.closeAll();
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }

                }
            );
        });

    @Effect({dispatch: false})
    commonPopup: Observable<Action> = this.actions$
        .ofType('COMMON_NOTIFICATION_POPUP')
        .do((action) => {
            let dialogRef = this.dialog.open(CommonNotificationPopup, {
                data: action.payload
            });
        });
    @Effect({dispatch: false})
    ratingPopup: Observable<Action> = this.actions$
        .ofType('POPUP_RATING')
        .do((action) => {
            let dialogRef = this.dialog.open(RatingPopupDialog, {
                data: action.payload
            });
        });
    @Effect({dispatch: false})
    acceptReschedule: Observable<Action> = this.actions$
        .ofType('ACCEPT_RESCHEDULE_REQUEST')
        .do((action) => {
            this._spinner.show();
            this.notificationService.rescheduleBooking(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode == 200) {
                        this.store.dispatch({
                            type: notification.actionTypes.ACCEPT_RESCHEDULE_REQUEST_SUCCESS, payload: result
                        });

                    }
                }
                , (error) => {
                    this._spinner.hide();
                    if (error) {
                        if (error.statusCode == 401) {
                            this.store.dispatch(new auth.AuthLogoutAction(error));
                        } else if (error.message) {
                            this.dialog.closeAll();
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: {message: error.message}
                            });
                        }
                    }
                }
            );
        });

    @Effect({dispatch: false})
    getAllTheNotifications$ = this.actions$
        .ofType('GET_ALL_NOTIFICATIONS')
        .do((action) => {
            this._spinner.show();
            this.notificationService.getAllNotifications(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode == 200) {
                        this.store.dispatch({
                            type: notification.actionTypes.GET_ALL_NOTIFICATION_SUCCESS, payload: result
                        });

                    }
                }
                , (error) => {
                    this._spinner.hide();
                    if (error) {
                        this.activatedRoute.queryParams.subscribe((params: any) => {
                            if (params.location != undefined && error.statusCode === 401) {
                                this.store.dispatch({
                                    type: auth.actionTypes.LOGGED_OUT_USER,

                                });
                            } else {
                                if (error.statusCode == 401) {
                                    this.store.dispatch(new auth.AuthLogoutAction(error));
                                } else if (error.message) {
                                    this.dialog.closeAll();
                                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                                        data: {message: error.message}
                                    });
                                }
                            }

                        });

                        if (error.statusCode == 401) {
                            this.store.dispatch(new auth.AuthLogoutAction(error));
                        } else if (error.message) {
                            this.dialog.closeAll();
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: {message: error.message}
                            });
                        }
                        // if (error.statusCode === 401 || error.statusCode === 403) {
                        //     this.store.dispatch({
                        //         type: app.actionTypes.APP_AUTHENTICATION_FAIL, payload: error
                        //     });
                        // }
                    }
                }
            );
        });

    @Effect({dispatch: false})
    readNotification: Observable<any> = this.actions$
        .ofType('READ_NOTIFICATION')
        .withLatestFrom(this.store)
        .do((storeState) => {
            let action = storeState[0].payload;
            let state = storeState[1].notification;
            this.notificationService.readNotification(action).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({type: notification.actionTypes.GET_ALL_NOTIFICATIONS, payload: {currentPage: 1, limit: 20}});
                    }
                }, (error) => {
                    if (error) {
                        if (error.statusCode == 401) {
                            this.store.dispatch(new auth.AuthLogoutAction(error));
                        } else if (error.message) {
                            this.dialog.closeAll();
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: {message: error.message}
                            });
                        }
                    }
                }
            );
        });

    @Effect({dispatch: false})
    seeAllNotification: Observable<any> = this.actions$
        .ofType('SEE_ALL_NOTIFICATION')
        .withLatestFrom(this.store)
        .do((storeState) => {
            let data = '';
            this.notificationService.seeAllNotification(data).subscribe((result) => {
                    if (result.statusCode === 200) {
                        // action.payload.isRead = true;
                        // this.store.dispatch({ type: notification.actionTypes.SHOW_NOTIFICATION, payload: action.payload });
                        this.store.dispatch({type: notification.actionTypes.SEE_ALL_NOTIFICATION_SUCCESS});
                    }
                }
                , (error) => {
                    if (error) {
                        if (error.statusCode == 401) {
                            this.store.dispatch(new auth.AuthLogoutAction(error));
                        } else if (error.message) {
                            this.dialog.closeAll();
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: {message: error.message}
                            });
                        }
                    }
                }
            );
        });

    @Effect({dispatch: false})
    pushNotificationsSuccess: Observable<Action> = this.actions$
        .ofType('PUSH_NOTIFICATION')
        .do((action) => {
            this.store.dispatch({type: notification.actionTypes.PUSH_NOTIFICATION_SUCCESS, payload: action.payload});
        });
    @Effect({dispatch: false})
    acceptRescheduleSuccess: Observable<Action> = this.actions$
        .ofType('ACCEPT_RESCHEDULE_REQUEST_SUCCESS')
        .do((action) => {
            this.dialog.closeAll();
        });

}


