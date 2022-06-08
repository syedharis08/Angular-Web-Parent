import { Component, Renderer } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { CanActivate, Router } from '@angular/router';
import * as sessionsDetails from './../../state/all-sessions.actions';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';
import { CancelSessionDialog } from '../cancel-session/cancel-session-dialog.component';
import 'style-loader!./reschedule-session-detail.scss';
import { Subscription } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import * as reschedular from './../re-schedular/state/re-schedular.actions';
import * as moment from 'moment';

@Component({
    selector: 'reschedule-session-detail',
    templateUrl: `./reschedule-session-detail.html`
})
export class RescheduleSessionDetail {

    public bookingId;
    public reschedule_startTime;
    public sessionStore: Subscription;
    public sessionDetailsStore: Subscription;
    public bookingDetails: any;
    public reschedule_endTime;
    public reschedule_tutor_id;
    public rescheduledBookingDetails;
    rescheduled_data;

    constructor(private store: Store<any>, private renderer: Renderer, private router: Router, private fb: FormBuilder, private sessionService: AllSessionService, private dialog: MatDialog) {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });

        if (localStorage.getItem('bookingId')) {
            this.bookingId = localStorage.getItem('bookingId');
        } else {
            this.bookingId = '';
        }

        if (this.bookingId) {
            this.store.dispatch({
                type: sessionsDetails.actionTypes.GET_BOOKING_BY_ID,
                payload: this.bookingId
            });
        }
        this.sessionStore = this.store.select('reschedular').subscribe((res: any) => {
            if (res) {
                if (res.rescheduledStepData && res.rescheduledStepData != undefined) {
                    this.rescheduled_data = res.rescheduledStepData;
                    if (this.rescheduled_data != undefined) {
                        if (moment(this.rescheduled_data.startTime).month() == 4) {
                            this.reschedule_startTime = moment(this.rescheduled_data.startTime).format('MMM D, YYYY | h:mmA');
                        } else {
                            this.reschedule_startTime = moment(this.rescheduled_data.startTime).format('MMM. D, YYYY | h:mmA');
                        }
                        this.reschedule_endTime = moment(this.rescheduled_data.endTime).format('h:mmA ');
                    }

                } else {
                    if (localStorage.getItem('Rescheduled_Data') && localStorage.getItem('Rescheduled_Data') != undefined) {
                        this.rescheduled_data = JSON.parse(localStorage.getItem('Rescheduled_Data'));
                    }
                }

            }
        });
        this.sessionDetailsStore = this.store.select('sessionsDetails').subscribe((res: any) => {
            if (res) {
                if (res.bookingById && res.bookingById != undefined) {
                    this.rescheduledBookingDetails = res.bookingById;
                }

            }
        });

    }

    ngOnInit() {
    }

    cancelSession() {
        let ref = this.dialog.open(CancelSessionDialog);
    }

    ngAfterViewInit() {
    }

    confirmRescheduling() {
        let fd = new FormData();

        if (this.rescheduled_data && this.rescheduled_data != undefined) {
            fd.append('startTime', this.rescheduled_data.startTime);
            fd.append('endTime', this.rescheduled_data.endTime);
            fd.append('slots', this.rescheduled_data.slots);

            this.store.dispatch({
                type: reschedular.actionTypes.RESCHEDULE_BOOKING,
                payload: fd
            });
        }
    }

    ngOnDestroy() {
        if (this.sessionStore && this.sessionStore != undefined) {
            this.sessionStore.unsubscribe();
        }
    }
}
