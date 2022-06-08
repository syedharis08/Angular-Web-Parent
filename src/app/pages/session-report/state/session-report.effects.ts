import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AllSessionService } from '../../../services/all-sessions-service/all-sessions.service';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { cloneDeep, random } from 'lodash';
import * as auth from '../../../auth/state/auth.actions';
import * as reports from '../state/session-report.actions';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from '../../../theme/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonErrorDialog } from '../../../auth/model/common-error-dialog/common-error-dialog';


// import { OtpDialog } from '../components/otp-verify/otp-verify-dialog.component';
const types = ['success', 'error', 'info', 'warning'];

@Injectable()
export class ReportsEffects {
   
    

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private toastrService: ToastrService,
        private allSessionService: AllSessionService,
        private _spinner: BaThemeSpinner,
        private dialog: MatDialog,
    ) {
    }
    @Effect({ dispatch: false })
    sessionReports$ = this.actions$
        .ofType('GET_ALL_REPORTS')
        .do((action) => {
            this._spinner.show();        
            this.allSessionService.getAllReports(action.payload).subscribe((result) => {    
                this._spinner.hide();
                if(result.statusCode === 200) 
                {
                    this.store.dispatch({
                        type: reports.actionTypes.GET_ALL_REPORTS_SUCCESS,
                        payload: result.data
                    });
                }   
                else{
                }
                  }
                , (error) => {
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
        sessionReportsCount$ = this.actions$
            .ofType('GET_ALL_REPORTS_COUNT')
            .do((action) => {
                this._spinner.show();
         
            this.allSessionService.getAllReportsCount().subscribe((result) => {           
            
                this._spinner.hide();
                if(result.statusCode === 200) 
                {
                    this.store.dispatch({
                        type: reports.actionTypes.GET_ALL_REPORTS_COUNT_SUCCESS,
                        payload: result.data
                    });
                }                 
                  }
                , (error) => {
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
    sessionReportssuccess$ = this.actions$
        .ofType('GET_ALL_REPORTS_SUCCESS')
        .do((action) => {
            this._spinner.show();
            this.store.dispatch({
                type: reports.actionTypes.GET_ALL_REPORTS_COUNT,
            });          
        
        });

}

