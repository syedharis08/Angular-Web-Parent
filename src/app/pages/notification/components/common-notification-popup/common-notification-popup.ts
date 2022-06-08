import { Component, ViewChild, ElementRef, Renderer, Inject } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { BaThemeSpinner } from '../../../../theme/services';
import { EmailValidator } from '../../../../theme/validators';
import 'style-loader!./common-notification-popup.scss';
import { Store } from '@ngrx/store';
import * as auth from '../../../../auth/state/auth.actions';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
@Component({
    selector: 'common-notification-popup',
    templateUrl: './common-notification-popup.html',
    styleUrls: ['./common-notification-popup.scss']
})

export class CommonNotificationPopup {
    public notificationData: any;
    public title: string;
    public messsage: string;
    public startTime;
    public endTime;
    sessionTimes: boolean;
    // public sessionstartTime;
    // public sessionEndTime;
    constructor(private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private baThemeSpinner: BaThemeSpinner,
        private toastrService: ToastrService,
        private renderer: Renderer,
        private dialog: MatDialog,
        private store: Store<any>,
    ) {
        if (data && data != undefined) {
            this.notificationData = data;
            if (this.notificationData != undefined && this.notificationData.booking != undefined) {
                let title = this.notificationData.type;
                switch (title) {
                    case 'RESCHEDULE_ACCEPTED_BY_TUTOR': {
                        this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");
                        if (moment(this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'CANCEL_BOOKING_BY_PARENT': {
                        this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");
                        if (moment(this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'RESCHEDULE_REQUEST_BY_PARENT': {

                        this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");
                        if (moment(this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'START_SESSION': {
                        if (moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = '';
                        break;
                    }
                    case 'ADMIN_UPDATE_SESSION_TIMES_PARENT': {
                        this.sessionTimes = true;
                        break;
                    }
                    case 'ON_THE_WAY': {
                        this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");
                        this.endTime = moment(this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'END_SESSION': {
                        if (moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.sessionEndTime ? this.notificationData.booking.sessionEndTime : this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'RAISE_DISPUTE': {
                        if (moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.sessionEndTime ? this.notificationData.booking.sessionEndTime : this.notificationData.booking.endTime).format("h:mmA ");

                        break;
                    }
                    case 'SESSION_FEEDBACK': {
                        if (moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.sessionEndTime ? this.notificationData.booking.sessionEndTime : this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'RATING': {
                        if (moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.sessionEndTime ? this.notificationData.booking.sessionEndTime : this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'BOOKING_COMPLETED': {
                        if (moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.sessionStartTime ? this.notificationData.booking.sessionStartTime : this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.sessionEndTime ? this.notificationData.booking.sessionEndTime : this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'SESSION_REMINDER_BEFORE_48_HOURS': {
                        this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");
                        if (moment(this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'PARENT_NO_SHOW': {
                        this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");
                        if (moment(this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'PARENT_LATE_CANCELLATION': {
                        this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");
                        if (moment(this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }
                    case 'CREDIT_CARD_CHARGED_AFTER_24_HOURS': {
                        this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");
                        if (moment(this.notificationData.booking.startTime).month() == 4) {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                        }
                        else {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                        }
                        this.endTime = moment(this.notificationData.booking.endTime).format("h:mmA ");
                        break;
                    }

                    default:
                        {
                            this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");
                            if (moment(this.notificationData.booking.startTime).month() == 4) {
                                this.startTime = moment(this.notificationData.booking.startTime).format("MMM D, YYYY | h:mmA");

                            }
                            else {
                                this.startTime = moment(this.notificationData.booking.startTime).format("MMM. D, YYYY | h:mmA");

                            }
                            this.endTime = moment(this.notificationData.booking.endTime).format("h:mmA ");
                            break;
                        }


                }
            }
        }
    }
    closeDialog() {
        this.dialog.closeAll();
    }
    onSubmit(value) {

    }

}
