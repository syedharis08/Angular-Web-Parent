import { BaThemeSpinner } from './../../../../../theme/services/baThemeSpinner/baThemeSpinner.service';
import { CalendarEventService } from './../../../../../services/calender-service/calendar-event.service';
import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { cloneDeep, random } from 'lodash';
import * as app from '../../../../../state/app.actions';
import * as reschedular from './re-schedular.actions';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CompletedBookingDialog } from './../../../../book-session/components/completed-booking-dialog/completed-booking-dialog.component';
const types = ['success', 'error', 'info', 'warning'];
import * as auth from '../../../../../auth/state/auth.actions';
import { CommonErrorDialog } from '../../../../../auth/model/common-error-dialog/common-error-dialog';

@Injectable()
export class ReSchedularEffects {

    @Effect({ dispatch: false })
    reschedule$ = this.actions$
        .ofType('RESCHEDULE_BOOKING')
        .do((action) => {

            this._spinner.show();
            this.calendarEventService.rescheduleBooking(action.payload).subscribe((result) => {
                this._spinner.hide();
                if (result.statusCode == 200) {
                    let payload = result.data;
                  
                    this.store.dispatch({
                        type: reschedular.actionTypes.RESCHEDULE_BOOKING_SUCCESS,
                        payload: result.data
                    });
                } else {
                    this._spinner.hide();
                }
            }
                , (error) => {
                    this._spinner.hide();
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
    rescheduleSuccess$ = this.actions$
        .ofType('RESCHEDULE_BOOKING_SUCCESS')
        .do((action) => {
            let ref = this.dialog.open(CompletedBookingDialog)
            // this.router.navigate(['/pages/all-sessions']);


        });
        @Effect({ dispatch: false })
        rescheduleData$ = this.actions$
            .ofType('RESCHEDULE_BOOKING_DATA')
            .do((action) => {
                this.store.dispatch({
                    type: reschedular.actionTypes.RESCHEDULE_BOOKING_DATA_SUCCESS,
                    payload: action.payload
                });
            });
    @Effect({ dispatch: false })
    goToreschedule$ = this.actions$
        .ofType('GOTO_RESCHEDULE')
        .do((action) => {

            this.store.dispatch({
                type: reschedular.actionTypes.GOTO_RESCHEDULE_SUCCESS,
                payload: action.payload
            });
            this.router.navigate(['/pages/all-sessions/reschedule-session-detail'])


        });


    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private toastrService: ToastrService,
        private calendarEventService: CalendarEventService,
        private dialog: MatDialog,
        private _spinner: BaThemeSpinner
    ) {
    }

}

