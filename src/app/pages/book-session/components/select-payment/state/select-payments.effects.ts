import { BaThemeSpinner } from './../../../../../theme/services/baThemeSpinner/baThemeSpinner.service';

import { SelectPaymentService } from './../../../../../services/select-payment/select-payments.service';

import { get } from 'lodash';
import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { cloneDeep, random } from 'lodash';
import * as selectPayment from '../state';
import * as  profile from '../../../../profile/state';
import * as auth from '../../../../../../app/auth/state/auth.actions';
import { CommonErrorDialog } from '../../../../../auth/model/common-error-dialog/common-error-dialog';
import { MatDialog } from '@angular/material';


const types = ['success', 'error', 'info', 'warning'];

@Injectable()
export class SelectPaymentEffects {

    @Effect({ dispatch: false })
    addCard$ = this.actions$
        .ofType('SELECT_ADD_CARD')
        .do((action) => {

            this.paymentservice.addNewCard(action.payload).subscribe(
                (result) => {
                    if (result.statusCode == 200) {
                        let payload = result.data;
                        let el = $('#moveUp');
                        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
                            el.focus();
                        });
                        this._spinner.hide();
                        this.store.dispatch(new selectPayment.SelectAppAddCardSuccess(payload));
                        this.zone.run(() => {
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: { message: result.message }
                            });
                        });
                    }
                },
                (error) => {
                    this.zone.run(() => {
                        this._spinner.hide();
                        if (error.statusCode == 401) {
                            this.store.dispatch(new auth.AuthLogoutAction(error));
                        }
                        else if (error.message) {
                            this.dialog.closeAll();
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: { message: error.message }
                            });
                        }
                    });
                   
                }
            );
        });
    @Effect({ dispatch: false })
    applyPromocode$ = this.actions$
        .ofType('APPLY_PROMOCODE')
        .do((action) => {

            this.paymentservice.applyPromoCode(action.payload).subscribe(
                (result) => {
                    if (result.statusCode == 200) {
                        this._spinner.hide();
                        let payload = result.data;
                        //   this.toastrService.success('Promo Code applied Successfully','Success!');
                        // this.zone.run(() => {
                        //     let dialogRef = this.dialog.open(CommonErrorDialog, {
                        //         data: { message: result.message }
                        //     });
                        // });
                        this.store.dispatch({
                            type: selectPayment.actionTypes.APPLY_PROMOCODE_SUCCESS,
                            payload: result

                        });
                    }
                },
                (error) => {
                    this._spinner.hide();                    
                    if (localStorage.getItem('PROMOCODE') != undefined) {
                        localStorage.removeItem('PROMOCODE')
                    }
                    this.store.dispatch({
                        type: selectPayment.actionTypes.APPLY_PROMOCODE_ERROR,
                        payload: {valid:false}

                    });
                    this.zone.run(() => {
                        if (error.statusCode == 401) {
                            this.store.dispatch(new auth.AuthLogoutAction(error));
                        }
                        else if (error.message) {
                            this.dialog.closeAll();
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: { message: error.message }
                            });
                        }
                    });
                    
                    
                }
            );
        });
    @Effect({ dispatch: false })
    deleteCard$ = this.actions$
        .ofType('SELECT_DELETE_CARD')
        .do((action) => {
            this.paymentservice.deleteCard(action.payload).subscribe(
                (result) => {
                    if (result.statusCode == 200) {
                        let payload = result.data;
                        this.toastrService.error('Card Deleted Successfully', 'DELETE');
                        this.store.dispatch(new selectPayment.SelectAppDeleteCardSuccess(payload));
                    }
                },
                (error) => {
                    this._spinner.hide();                                        
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    }
                    else if (error.message) {
                        this.dialog.closeAll();
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: { message: error.message }
                        });
                    }
                }
            );
        });

    @Effect({ dispatch: false })
    defaultCard$ = this.actions$
        .ofType('SELECT_DEFAULT_CARD')
        .do((action) => {
            this.paymentservice.setdefaultCard(action.payload).subscribe(
                (result) => {
                    this._spinner.hide();
                    if (result.statusCode == 200) {
                        let payload = result.data;
                        this.store.dispatch(new selectPayment.SelectAppDefaultCardSuccess(payload));
                    }
                },
                (error) => {
                    this._spinner.hide();                                        
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    }
                    else if (error.message) {
                        this.dialog.closeAll();
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: { message: error.message }
                        });
                    }
                }
            );
        });
    @Effect({ dispatch: false })
    addCardSuccess$ = this.actions$
        .ofType('SELECT_ADD_CARD_SUCCESS')
        .do((action) => {
            let fd = new FormData();
            fd.append('deviceType', 'WEB');
            this.store.dispatch({
                type: profile.actionTypes.GET_PARENT_PROFILE,
                payload: fd
            });

        });
    @Effect({ dispatch: false })
    updateCard$ = this.actions$
        .ofType('SELECT_UPDATE_CARD')
        .do((action) => {

            this.paymentservice.updateCard(action.payload).subscribe(
                (result) => {
                    if (result.statusCode == 200) {
                        let payload = result.data;                     
                        this.store.dispatch(new selectPayment.SelectAppUpdateCardSuccess(payload));
                    }
                },
                (error) => {
                    this._spinner.hide();                                        
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    }
                    else if (error.message) {
                        this.dialog.closeAll();
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: { message: error.message }
                        });
                    }
                }
            );
        });



    constructor(
        private actions$: Actions,
        private dialog: MatDialog,
        private store: Store<any>,
        public zone: NgZone,
        private router: Router,
        private toastrService: ToastrService,
        private paymentservice: SelectPaymentService,
        private _spinner: BaThemeSpinner,
    ) {
    }

}

