import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DisputesService } from '../../../services/disputes-service/disputes-service';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { cloneDeep, random } from 'lodash';
import * as auth from '../../../auth/state/auth.actions';
import * as disputes from '../state/disputes.actions';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from '../../../theme/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


// import { OtpDialog } from '../components/otp-verify/otp-verify-dialog.component';
const types = ['success', 'error', 'info', 'warning'];

@Injectable()
export class DisputesEffects {
   
    

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private toastrService: ToastrService,
        private disputeService: DisputesService,
        private _spinner: BaThemeSpinner,
        private dialog: MatDialog,
    ) {
    }

    @Effect({ dispatch: false })
    getDisputeById$ = this.actions$
        .ofType('GET_DISPUTE_BY_ID')
        .do((action) => {
            this._spinner.show();
        
            this.disputeService.getDisputeById(action.payload).subscribe((result) => {           
               
                this._spinner.hide();
                if(result.statusCode === 200) 
                {
                    // this.toastrService.clear();
                    // this.toastrService.success(result.message || 'Success', 'Success');
                    this.store.dispatch({
                        type: disputes.actionTypes.GET_DISPUTE_BY_ID_SUCCESS,
                        payload: result.data
                    });
                }   
                else{
                }
                  }
                , (error) => {
                    this._spinner.hide();
                    this.toastrService.error(error.message || '', 'Error');
                    if(error.statusCode == 401)
                    {                        this.store.dispatch(new auth.AuthLogoutAction(error));
                       
                    }
                }
            );
        });

    @Effect({ dispatch: false })
    allDisputes$ = this.actions$
        .ofType('GET_ALL_DISPUTES')
        .do((action) => {
            this._spinner.show();
        
            this.disputeService.getAllDisputes(action.payload).subscribe((result) => {           
               
                this._spinner.hide();
                if(result.statusCode === 200) 
                {
                    // this.toastrService.clear();
                    // this.toastrService.success(result.message || 'Success', 'Success');
                    this.store.dispatch({
                        type: disputes.actionTypes.GET_ALL_DISPUTES_SUCCESS,
                        payload: result.data
                    });
                }   
                else{
                }
                  }
                , (error) => {
                    this._spinner.hide();
                    this.toastrService.error(error.message || '', 'Error');
                    if(error.statusCode == 401)
                    {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                       
                    }
                }
            );
        });
        @Effect({ dispatch: false })
        allDisputesCount$ = this.actions$
            .ofType('GET_ALL_DISPUTES_COUNT')
            .do((action) => {
                this._spinner.show();
         
                this.disputeService.getAllDisputesCount().subscribe((result) => {           
            
                this._spinner.hide();
                if(result.statusCode === 200) 
                {
                    // this.toastrService.clear();
                    // this.toastrService.success(result.message || 'Success', 'Success');
                    this.store.dispatch({
                        type: disputes.actionTypes.GET_ALL_DISPUTES_COUNT_SUCCESS,
                        payload: result.data
                    });
                }   
                else{
                }
                  }
                , (error) => {
                    this._spinner.hide();
                    this.toastrService.error(error.message || '', 'Error');
                    if(error.statusCode == 401)
                    {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                       
                    }
                }
            );
            });
        @Effect({ dispatch: false })
        allDisputesssuccess$ = this.actions$
        .ofType('GET_ALL_DISPUTES_SUCCESS')
        .do((action) => {
            this._spinner.show();
            this.store.dispatch({
                type: disputes.actionTypes.GET_ALL_DISPUTES_COUNT,
            });
           
        
        });

}

