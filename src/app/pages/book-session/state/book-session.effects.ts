import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BookSessionService } from '../../../services/session-service/session.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as profile from '../../../pages/profile/state/profile.actions';
import * as session from './book-session.actions';
import * as auth from '../../../auth/state/auth.actions';
import * as selectPayments from '../../../pages/book-session/components/select-payment/state/select-payments.actions';
import {  BaThemeSpinner } from '../../../theme/services';
import { MatDialog } from '@angular/material/dialog';
import { PopUpOtpService } from '../../../auth/model/popup-otp/popup-otp.service';
import { PopUpService } from '../../../auth/model/popup/popup.service';
import { CompletedBookingDialog } from './../components/completed-booking-dialog/completed-booking-dialog.component';
import { BrowseTuttorError450 } from '../../../auth/model/browse-tutor-450-error/browse-tutor-450-error-dialog.component';
import { BrowseTuttorError451 } from '../../../auth/model/browse-tutor-451-error/browse-tutor-451-error-dialog.component';
import { NoTutorDialog } from '../../../auth/model/no-tutor-dialog/no-tutor-dialog.component';
import { CommonErrorDialog } from '../../../auth/model/common-error-dialog/common-error-dialog';
import { CheckTutorDialog } from '../../../auth/model/check-tutor-dialog/check-tutor-dialog';
declare const dataLayer: any;

@Injectable()
export class BookSessionEffects {

    public currentUser;
    public get_count;
    public tutorId;
    @Effect({dispatch: false})
    gotoStep2$ = this.actions$.ofType('STEPONE_DATA').do((action) => {
        this.store.dispatch({
            type: session.actionTypes.STEPONE_DATA_SUCCESS,
            payload: action.payload
        });

    });
    @Effect({dispatch: false})
    gotoStep3$ = this.actions$.ofType('GOTO_BOOK_SESSION_STEP3').do((action) => {
        this.store.dispatch({
            type: session.actionTypes.GOTO_BOOK_SESSION_STEP3_SUCCESS,
            payload: action.payload
        });
    });
    @Effect({dispatch: false})
    gotoStep3succ$ = this.actions$.ofType('GOTO_BOOK_SESSION_STEP3_SUCCESS').do((action) => {
        let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
        setTimeout(() => {
            lines[1].className = 'blue-line mat-stepper-horizontal-line';
        }, 500);
    });

    @Effect({dispatch: false})
    selectTutor$ = this.actions$.ofType('SELECT_TUTOR').do(action => {
        this.get_count = action.payload;
        this.bookSession.browseTutor(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: session.actionTypes.SELECT_TUTOR_SUCCESS,
                        payload: {result: result, countPayload: this.get_count}
                    });
                    if (result.data.length == 0 && (localStorage.getItem('token') === undefined || !localStorage.getItem('token'))) {
                        this.zone.run(() => {
                            let dialogRef = this.dialog.open(NoTutorDialog);
                        });
                    }
                }

            }
            , (error) => {
                this.store.dispatch({
                    type: session.actionTypes.SELECT_TUTOR_SUCCESS,
                    payload: {result: undefined, countPayload: 0}
                });
                this._spinner.hide();
                if (error.statusCode == 450) {
                    this.zone.run(() => {
                        let dialogRef = this.dialog.open(BrowseTuttorError450);
                    });
                } else if (error.statusCode == 451) {
                    this.zone.run(() => {
                        let dialogRef = this.dialog.open(BrowseTuttorError451);
                    });
                } else if (error.statusCode == 401) {
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
    createBooking$ = this.actions$.ofType('COMPLETE_BOOKING').do(action => {
        this._spinner.show();
        this.bookSession.createBooking(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    // localStorage.removeItem('userData');
                    let domainParts = window.location.host.split('.');
                    domainParts.shift();
                    let domain = '.' + domainParts.join('.');
                    let expireDate = new Date();
                    let d = expireDate.toUTCString();
                    document.cookie = 'userData=' + 'bookingData' + ';domain=' + domain + ';expires=' + d + '; SameSite=Strict; secure';

                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'Book a Session',
                        eventAction: 'Book a Session Step 4 Payment',
                        eventLabel: 'Book a Session Step 4 Send Request'
                    });
                    dataLayer.push({
                        'event': 'Booked Session',
                        'Category': 'Book a Session',
                        'Label': 'Book a Session Step 4 Payment',
                        'Action': ' Book a Session Step 4 Send Request'
                    });
                    if (localStorage.getItem('slotSelected') != undefined) {
                        localStorage.removeItem('slotSelected');
                    }

                    this.store.dispatch({
                        type: session.actionTypes.COMPLETE_BOOKING_SUCCESS,
                        payload: result
                    });

                    // let fd = new FormData();
                    // fd.append('deviceType', 'WEB');
                    // this.store.dispatch({
                    //     type: profile.actionTypes.GET_PARENT_PROFILE,
                    //     payload: fd
                    // });

                } else {

                }
            }
            , (error) => {
                this._spinner.hide();
                this.store.dispatch({
                    type: selectPayments.actionTypes.DESTROY_VALUES
                });
                this.zone.run(() => {
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message) {
                        this.dialog.closeAll();
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }
                });
            }
        );

    });

    @Effect({dispatch: false})
    getTutorratings$ = this.actions$.ofType('SELECT_GET_TUTOR_RATINGS').do(action => {
        this.tutorId = action.payload.tutorId;
        this._spinner.show();
        this.bookSession.getTutorRatings(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: session.actionTypes.SELECT_GET_TUTOR_RATING_SUCCESS,
                        payload: result
                    });
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
    ratingSuccess$ = this.actions$.ofType('SELECT_GET_TUTOR_RATING_SUCCESS').do(action => {

        this.store.dispatch({
            type: session.actionTypes.SELECT_GET_TUTOR_RATING_COUNT,
            payload: this.tutorId
        });
    });
    @Effect({dispatch: false})
    ratingCount$ = this.actions$.ofType('SELECT_GET_TUTOR_RATING_COUNT').do(action => {

        this.bookSession.getTutorRatingsCount(action.payload).subscribe((result) => {
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: session.actionTypes.SELECT_GET_TUTOR_RATING_SUCCESS_COUNT,
                        payload: result
                    });
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
    checkTutorAvailability$ = this.actions$.ofType('CHECK_TUTOR_AVAILABILITY').do(action => {

        this.bookSession.checkTutorAvailability(action.payload).subscribe((result) => {
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: session.actionTypes.CHECK_TUTOR_AVAILABILITY_SUCCESS,
                        payload: result
                    });
                }

            }
            , (error) => {
                this._spinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else {
                    this.zone.run(() => {
                        let dialogRef = this.dialog.open(CheckTutorDialog, {
                            data: {message: error.message}
                        });
                    });
                }
            }
        );
    });

    @Effect({dispatch: false})
    checkTutorAvailabilitySuccess$ = this.actions$.ofType('CHECK_TUTOR_AVAILABILITY_SUCCESS').do(action => {
        //    this.router.navigate(['/pages/book-session/select-card'])

    });

    @Effect({dispatch: false})
    getTutorDetail$ = this.actions$.ofType('GET_TUTOR_DETAILS').do(action => {
        this._spinner.show();
        this.bookSession.getTutorDetails(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: session.actionTypes.GET_TUTOR_DETAILS_SUCCESS,
                        payload: result
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
    @Effect({dispatch: false})
    getTutorDetailByUId$ = this.actions$.ofType('GET_TUTOR_DETAILS_BY_UID').do(action => {
        this._spinner.show();
        this.bookSession.getTutorDetailsByUId(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: session.actionTypes.GET_TUTOR_DETAILS_SUCCESS,
                        payload: result
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
    @Effect({dispatch: false})
    completeBookingSucc$ = this.actions$.ofType('COMPLETE_BOOKING_SUCCESS').do(action => {
        let dialogRef = this.dialog.open(CompletedBookingDialog, {disableClose: true});

        // let dialogRef = this.dialog.open(CompletedBookingDialog,disable:true);

        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });

        this.store.dispatch({
            type: selectPayments.actionTypes.DESTROY_VALUES
        });

    });
    @Effect({dispatch: false})
    getToPayments$ = this.actions$.ofType('GO_TO_PAYMENTS').do(action => {
        this.store.dispatch({
            type: session.actionTypes.GO_TO_PAYMENTS_SUCCESS,
            payload: action.payload
        });

    });

    @Effect({dispatch: false})
    getToPaymentsSuccess$ = this.actions$.ofType('GO_TO_PAYMENTS_SUCCESS').do(action => {
        this.router.navigate(['/pages/book-session/select-card']);

    });

    @Effect({dispatch: false})
    browseTutortSuccess: Observable<Action> = this.actions$.ofType('SELECT_TUTOR_SUCCESS').do((action) => {
            if (action.payload && action.payload != undefined) {
                this.store.dispatch({
                    type: session.actionTypes.GET_TUTOR_COUNT,
                    payload: {count: action.payload.countPayload, searchType: 'BOOK_A_SESSION'}
                });
            }
        }
        , (error) => {
            this._spinner.hide();
        });

    @Effect({dispatch: false})
    goToStep2: Observable<Action> = this.actions$.ofType('GOTO_BOOK_SESSION_STEP2').do((action) => {
            this._spinner.show();
            this.store.dispatch({
                type: session.actionTypes.GOTO_BOOK_SESSION_STEP2_SUCCESS
            });
            this.router.navigate(['/pages/book-session/session']);

        }
        , (error) => {
            this._spinner.hide();

        });
    @Effect({dispatch: false})
    goToStep2Success: Observable<Action> = this.actions$.ofType('GOTO_BOOK_SESSION_STEP2_SUCCESS').do((action) => {
        }
        , (error) => {
            this._spinner.hide();

        });
    @Effect({dispatch: false})
    getCount$ = this.actions$.ofType('GET_TUTOR_COUNT').do(action => {
        // this._spinner.show()
        this.bookSession.getCount(action.payload.count).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode === 200) {
                    this.store.dispatch({
                        type: session.actionTypes.GET_TUTOR_COUNT_SUCCESS,
                        payload: result
                    });
                } else {
                    this.store.dispatch({
                        type: session.actionTypes.GET_TUTOR_COUNT_SUCCESS,
                        payload: undefined
                    });
                }
            }
            , (error) => {
                this._spinner.hide();
                this.store.dispatch({
                    type: session.actionTypes.GET_TUTOR_COUNT_SUCCESS,
                    payload: undefined
                });
            }
        );

    });

    constructor(
        // public dialogRef: MatDialogRef<CompletedBookingDialog>,
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        public zone: NgZone,
        private toastrService: ToastrService,
        private bookSession: BookSessionService,
        private _spinner: BaThemeSpinner,
        private dialog: MatDialog,
        private popupOtp: PopUpOtpService,
        private popup: PopUpService
    ) {
    }

}

