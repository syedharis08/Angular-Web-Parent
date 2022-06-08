import { BaThemeSpinner } from './../../../theme/services/baThemeSpinner/baThemeSpinner.service';
import { PaymentService } from './../../../services/payments/payments.service';
import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as payment from '../state';
import * as profile from '../../profile/state/profile.actions';
import { MatDialog } from '@angular/material';
import { CommonErrorDialog } from '../../../auth/model/common-error-dialog/common-error-dialog';

const types = ['success', 'error', 'info', 'warning'];
import * as auth from './../../../auth/state/auth.actions';

@Injectable()
export class PaymentEffects {

    @Effect({dispatch: false})
    addCard$ = this.actions$.ofType('ADD_CARD').do((action) => {
        this._spinner.show();
        this.paymentservice.addNewCard(action.payload).subscribe(
            (result) => {
                this._spinner.hide();
                if (result.statusCode == 200) {
                    let payload = result.data;
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'My Wallet',
                        eventAction: 'Add New Card',
                        eventLabel: 'Add New Card'
                    });
                    if (result.message != undefined) {
                        this.zone.run(() => {
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: {message: result.message}
                            });
                        });
                    }
                    this.store.dispatch(new payment.AppAddCardSuccess(payload));
                }
            },
            (error) => {
                this._spinner.hide();
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
    deleteCard$ = this.actions$.ofType('DELETE_CARD').do((action) => {

        this.paymentservice.deleteCard(action.payload).subscribe(
            (result) => {
                if (result.statusCode == 200) {
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'My Wallet',
                        eventAction: 'Delete Card',
                        eventLabel: 'Delete Card'
                    });
                    let payload = result.data;
                    this.store.dispatch(new payment.AppDeleteCardSuccess(payload));
                    if (result.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: 'Card Deleted Successfully'}
                        });
                    }
                }
            },
            (error) => {
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
    defaultCard$ = this.actions$.ofType('DEFAULT_CARD').do((action) => {
        this.paymentservice.setdefaultCard(action.payload).subscribe(
            (result) => {
                if (result.statusCode == 200) {
                    let payload = result.data;
                    this.store.dispatch(new payment.AppDefaultCardSuccess(payload));
                    if (result.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: result.message}
                        });
                    }
                }
            },
            (error) => {
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
    addCardSuccess$ = this.actions$.ofType('ADD_CARD_SUCCESS').do((action) => {
        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });

    });
    @Effect({dispatch: false})
    deleteSuccess$ = this.actions$.ofType('DELETE_CARD_SUCCESS').do((action) => {
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });

    });
    @Effect({dispatch: false})
    updateCard$ = this.actions$.ofType('UPDATE_CARD').do((action) => {

        this.paymentservice.updateCard(action.payload).subscribe(
            (result) => {
                if (result.statusCode == 200) {
                    let payload = result.data;
                    let el = $('#moveUp');
                    $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                        el.focus();
                    });
                    if (result.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: result.message}
                        });
                    }
                    this.store.dispatch(new payment.AppUpdateCardSuccess(payload));
                }
            },
            (error) => {
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
    ChangePaymentMode$ = this.actions$.ofType('CHANGE_PAYMENT_METHOD').do((action) => {

        this._spinner.show();
        this.paymentservice.changePaymentMode(action.payload).subscribe(
            (result) => {
                this._spinner.hide();
                if (result.statusCode == 200) {
                    let payload = result.data;
                    if (result.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: result.message}
                        });
                        this.router.navigate(['/pages/all-sessions/session-details']);
                    } else {
                        this.router.navigate(['/pages/all-sessions/sessions']);
                    }
                    this.store.dispatch(new payment.ChangePaymentSuccess(payload));
                    if (localStorage.getItem('changePayment')) {
                        localStorage.removeItem('changePayment');
                    }
                } else {
                }
            },
            (error) => {
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message) {
                    this.dialog.closeAll();
                    this.router.navigate(['/pages/all-sessions/session-details']);
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                    this._spinner.hide();
                }
            }
        );
    });
    @Effect({dispatch: false})
    updateCardSuccess$ = this.actions$.ofType('UPDATE_CARD_SUCCESS').do((action) => {
        let fd = new FormData();
        fd.append('deviceType', 'WEB');

        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });

    });

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        public zone: NgZone,
        private dialog: MatDialog,
        private router: Router,
        private toastrService: ToastrService,
        private paymentservice: PaymentService,
        private _spinner: BaThemeSpinner
    ) {
    }

}

