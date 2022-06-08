import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AllSessionService } from '../../../services/all-sessions-service/all-sessions.service';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { cloneDeep, random } from 'lodash';
import * as sessionDetails from './all-sessions.actions';
import * as auth from '../../../auth/state/auth.actions';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from '../../../theme/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PopUpOtpService } from '../../../auth/model/popup-otp/popup-otp.service';
import { PopUpService } from '../../../auth/model/popup/popup.service';
import { CommonErrorDialog } from '../../../auth/model/common-error-dialog/common-error-dialog';
import { ReminderConfirmComponent } from '../../../shared/components/reminder-confirm/reminder-confirm.component';
import * as profile from '../../profile/state/profile.actions';
// import { OtpDialog } from '../components/otp-verify/otp-verify-dialog.component';
const types = ['success', 'error', 'info', 'warning'];

@Injectable()
export class ALLSessionEffects {
    public get_upcoming_count;
    public get_past_count;

    @Effect({dispatch: false})
    getInvoiceList$ = this.actions$.ofType('GET_INVOICE_LIST').do((action) => {
        this._spinner.show();
        this.get_upcoming_count = action.payload;
        this.allSessionService.getAllInvoices(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.GET_INVOICE_LIST_SUCCESS,
                        payload: {result: result.data, count: this.get_upcoming_count, formData: action.payload}
                    });
                } else {
                }
            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }

            }
        );
    });

    @Effect({dispatch: false})
    getAllUpcomingSessions$ = this.actions$.ofType('GET_ALL_UPCOMING_SESSIONS').do((action) => {
        this._spinner.show();
        this.get_upcoming_count = action.payload;
        this.allSessionService.getAllSessions(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.GET_ALL_UPCOMING_SESSIONS_SUCCESS,
                        payload: {result: result.data, count: this.get_upcoming_count}
                    });
                } else {

                }

            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));

                } else if (error.message != undefined) {

                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });

                }

            }
        );
    });
    @Effect({dispatch: false})
    getAllPastSessions$ = this.actions$.ofType('GET_ALL_PAST_SESSIONS').do((action) => {
        this._spinner.show();

        this.get_past_count = action.payload;
        this.allSessionService.getAllSessions(action.payload).subscribe((result) => {
                this._spinner.hide();

                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.GET_ALL_PAST_SESSIONS_SUCCESS,
                        payload: {result: result.data, count: this.get_past_count}
                    });
                } else {

                }

            }
            , (error) => {
                this._spinner.hide();
                // this.toastrService.error(error.message || 'Verification code is wrong', 'Error');
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
    getBookingByiD$ = this.actions$.ofType('GET_BOOKING_BY_ID').do((action) => {
        this._spinner.show();
        this.allSessionService.getBookingById(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {

                    this.store.dispatch({
                        type: sessionDetails.actionTypes.GET_BOOKING_BY_ID_SUCCESS,
                        payload: result.data
                    });
                } else {
                }
            }
            , (error) => {
                this._spinner.hide();
                // this.toastrService.error(error.message || 'Verification code is wrong', 'Error');
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });

                }
            }
        );
    });
    @Effect({dispatch: false})
    getcancellationPolicy$ = this.actions$.ofType('GET_CANCELLATION_POLICIES').do((action) => {
        this._spinner.show();
        this.allSessionService.getCancellationPolicy().subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    // this.toastrService.clear();
                    // this.toastrService.success(result.message || 'Success', 'Success');
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.GET_CANCELLATION_POLICIES_SUCCESS,
                        payload: result.data
                    });
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
    //Cancel tutor Booking
    @Effect({dispatch: false})
    cancelTutorBookingById$ = this.actions$.ofType('CANCEL_TUTOR_BOOKING').do((action) => {
        this._spinner.show();

        this.allSessionService.cancelTutorBookingById(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.CANCEL_BOOKING_BY_ID_SUCCESS,
                        payload: result.data
                    });
                }

            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });

                }

            }
        );
    });

    @Effect({dispatch: false})
    cancelBookingById$ = this.actions$.ofType('CANCEL_BOOKING_BY_ID').do((action) => {
        this._spinner.show();

        this.allSessionService.cancelBookingById(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.CANCEL_BOOKING_BY_ID_SUCCESS,
                        payload: result.data
                    });
                }

            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });

                }

            }
        );
    });
    //Accept tutor Booking
    @Effect({dispatch: false})
    acceptTutorBookingById$ = this.actions$.ofType('ACCEPT_TUTOR_BOOKING').do((action) => {
        this._spinner.show();

        this.allSessionService.acceptTutorBooking(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.CANCEL_BOOKING_BY_ID_SUCCESS,
                        payload: result.data
                    });
                }

            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });

                }

            }
        );
    });

    // @Effect({ dispatch: false })
    // cancelBookingById$ = this.actions$
    //     .ofType('CANCEL_BOOKING_BY_ID')
    //     .do((action) => {
    //         this._spinner.show();

    //         this.allSessionService.cancelBookingById(action.payload).subscribe((result) => {
    //             this._spinner.hide();
    //             if (result.statusCode === 200) {
    //                 this.store.dispatch({
    //                     type: sessionDetails.actionTypes.CANCEL_BOOKING_BY_ID_SUCCESS,
    //                     payload: result.data
    //                 });
    //             }

    //         }
    //             , (error) => {
    //                 this._spinner.hide();
    //                 if (error.statusCode == 401) {
    //                     this.store.dispatch(new auth.AuthLogoutAction(error));
    //                 }
    //                 else if (error.message != undefined) {
    //                     let dialogRef = this.dialog.open(CommonErrorDialog, {
    //                         data: { message: error.message }
    //                     });

    //                 }

    //             }

    //         );
    //     });

    //Check tutor is live or not
    @Effect({dispatch: false})
    checkTutorIsLive$ = this.actions$.ofType('CHECK_TUTOR_LIVE').do((action) => {
        this._spinner.show();

        this.allSessionService.checkTutorLive(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.CHECK_TUTOR_LIVE_SUCCESS,
                        payload: result.data
                    });
                }

            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });

                }

            }
        );
    });
    @Effect({dispatch: false})
    rateTutor$ = this.actions$.ofType('RATE_TUTOR').do((action) => {

        // let dialogRef = this.dialog.open(ReminderConfirmComponent, {
        //     data: action.payload.data
        // });return

        this._spinner.show();
        this.allSessionService.rateTutor(action.payload.apiData).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.dialog.closeAll();
                    if (localStorage.getItem('bookingId') && localStorage.getItem('bookingId') != undefined) {
                        let bookingId = localStorage.getItem('bookingId');
                        this.store.dispatch({
                            type: sessionDetails.actionTypes.GET_BOOKING_BY_ID,
                            payload: bookingId
                        });
                        let dialogRef = this.dialog.open(ReminderConfirmComponent, {
                            data: action.payload.data
                        });
                    }

                }

            }
            , (error) => {
                this._spinner.hide();

                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }
            }
        );
    });
    @Effect({dispatch: false})
    onlyRateTutor$ = this.actions$.ofType('ONLY_RATE_TUTOR').do((action) => {

        this._spinner.show();

        this.allSessionService.onlyRateTutor(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.dialog.closeAll();
                    if (localStorage.getItem('bookingId') && localStorage.getItem('bookingId') != undefined) {
                        let bookingId = localStorage.getItem('bookingId');

                        this.store.dispatch({
                            type: sessionDetails.actionTypes.GET_BOOKING_BY_ID,
                            payload: bookingId
                        });
                    }
                }

            }
            , (error) => {
                this._spinner.hide();
                // this.toastrService.error(error.message || 'Verification code is wrong', 'Error');
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }
            }
        );
    });

    @Effect({dispatch: false})
    getDisputeById$ = this.actions$.ofType('GET_DISPUTE_BY_ID').do((action) => {
        this._spinner.show();

        this.allSessionService.getDisputeById(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.GET_DISPUTE_BY_ID_SUCCESS,
                        payload: result.data
                    });
                } else {
                }
            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));

                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }
            }
        );
    });
    @Effect({dispatch: false})
    getAllSessionsSuccess$ = this.actions$.ofType('GET_ALL_UPCOMING_SESSIONS_SUCCESS').do((action) => {
        let res = this.get_upcoming_count;
        this.store.dispatch({
            type: sessionDetails.actionTypes.GET_ALL_UPCOMING_SESSIONS_COUNT,
            payload: {type: 'UPCOMING', limit: res.limit, skip: res.skip}
        });

    });

    @Effect({dispatch: false})
    getInvoiceListSuccess$ = this.actions$.ofType('GET_INVOICE_LIST_SUCCESS').do((action) => {
        let res = this.get_upcoming_count;
        this.store.dispatch({
            type: sessionDetails.actionTypes.GET_INVOICE_COUNT,
            payload: {limit: res.limit, skip: res.skip, formData: action.payload.formData}
        });

    });
    @Effect({dispatch: false})
    getAllPastSessionsSuccess$ = this.actions$.ofType('GET_ALL_PAST_SESSIONS_SUCCESS').do((action) => {
        let res = this.get_past_count;
        this.store.dispatch({
            type: sessionDetails.actionTypes.GET_ALL_PAST_SESSIONS_COUNT,
            payload: {type: 'PAST', limit: res.limit, skip: res.skip}
        });

    });
    @Effect({dispatch: false})
    getPastSessionsCount$ = this.actions$.ofType('GET_ALL_PAST_SESSIONS_COUNT').do((action) => {
        this._spinner.show();
        this.allSessionService.getSessionCount(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.GET_ALL_PAST_SESSIONS_COUNT_SUCCESS,
                        payload: result.data
                    });
                }
            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }
            }
        );
    });
    @Effect({dispatch: false})
    getUPCOMINGSessionsCount$ = this.actions$.ofType('GET_ALL_UPCOMING_SESSIONS_COUNT').do((action) => {
        this._spinner.show();
        this.allSessionService.getSessionCount(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.GET_ALL_UPCOMING_SESSIONS_COUNT_SUCCESS,
                        payload: result.data
                    });
                } else {
                }
            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }
            }
        );
    });

    @Effect({dispatch: false})
    getInvoiceCount$ = this.actions$.ofType('GET_INVOICE_COUNT').do((action) => {
        // this._spinner.show();
        this.allSessionService.getInvoiceCount(action.payload).subscribe((result) => {
                // this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.GET_INVOICE_COUNT_SUCCESS,
                        payload: result.data
                    });
                } else {
                }
            }
            , (error) => {
                // this._spinner.hide();
            }
        );
    });

    @Effect({dispatch: false})
    checkBookings$ = this.actions$.ofType('CHECK_BOOKINGS').do((action) => {
        this._spinner.show();
        this.allSessionService.checkBookings().subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    if (result.data != undefined) {
                        this.allSessionService.anyPastBooking = result.data.pastSession;
                    }
                    this.store.dispatch({
                        type: sessionDetails.actionTypes.CHECK_BOOKINGS_SUCCESS,
                        payload: result.data
                    });
                } else {
                }
            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }
            }
        );
    });

    @Effect({dispatch: false})
    checkBookingSuccess$ = this.actions$.ofType('CHECK_BOOKINGS_SUCCESS').do((action) => {
        let sessionTypePast = action.payload.pastSession;
        let sessionTypeUpcoming = action.payload.upcomingSession;
        if (sessionTypePast) {
            this.store.dispatch({
                type: sessionDetails.actionTypes.GET_ALL_PAST_SESSIONS,
                payload: {type: 'PAST', limit: 5, skip: 0}
            });
        } else {
            this.store.dispatch({
                type: sessionDetails.actionTypes.GET_ALL_UPCOMING_SESSIONS,
                payload: {type: 'UPCOMING', limit: 5, skip: 0}
            });
        }

    });

    @Effect({dispatch: false})
    cancelBookingSuccess$ = this.actions$.ofType('CANCEL_BOOKING_BY_ID_SUCCESS').do((action) => {
        this.dialog.closeAll();
        if (action.payload && action.payload.showMessage) {
            this.dialog.open(CommonErrorDialog, {
                data: {message: 'This tutoring hour will be credited back to your available hours. As a reminder, once your available hours have been used, please flag your account as out of hours again.'}
            });

            let fd = new FormData();
            fd.append('deviceType', 'WEB');
            this.store.dispatch({
                type: profile.actionTypes.GET_PARENT_PROFILE,
                payload: fd
            });
        }




        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });
        this.router.navigate(['/pages/all-sessions/sessions']);
    });

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private toastrService: ToastrService,
        private allSessionService: AllSessionService,
        private _spinner: BaThemeSpinner,
        private dialog: MatDialog
    ) {
    }

}

