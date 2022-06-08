import { Component, Renderer, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as sessionsDetails from './../../../all-sessions/state/all-sessions.actions';
import { RaiseDisputeDialog } from '../../../all-sessions/components/raise-dispute/raise-dispute.component';
import 'style-loader!./rating-popup.scss';
import * as notification from '../../state/notification.actions';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'rating-popup',
    templateUrl: './rating-popup.html'

})
export class RatingPopupDialog {
    notificationType: any;
    showError2: boolean = false;
    dateEnd: string;
    dateStart: string;
    sessionlength: number;
    date: string;
    totalAmount;
    endTime: string;
    startTime: string;
    message: any;
    hours: string = 'hours';
    currentRate: number = 0;
    rateTutorData: any;
    showError: boolean = false;
    public ratedTutor: boolean = false;
    public notificationStore: Subscription;
    originalStartTime: string;
    originalEndTime: string;

    constructor(public dialogRef: MatDialogRef<RatingPopupDialog>, @Inject(MAT_DIALOG_DATA) public Data: any,
                private dialog: MatDialog, private renderer: Renderer, private store: Store<any>) {

        if (this.Data != undefined && this.Data.booking && this.Data.booking != undefined) {
            let notificationId = this.Data._id;
            this.store.dispatch({
                type: notification.actionTypes.GET_NOTIFICATION_BY_ID,
                payload: {notificationId: this.Data._id}
            });
            this.date = moment(this.Data.booking.startTime).format('MMM. D, YYYY | h:mmA');
            this.dateStart = moment(this.Data.booking.startTime).format('MMM. D, YYYY | h:mmA');
            this.dateEnd = moment(this.Data.booking.endTime).format('h:mmA ');

            if (moment(this.Data.booking.sessionStartTime).month() == 4) {
                this.startTime = moment(this.Data.booking.sessionStartTime).format('MMM D, YYYY | h:mmA');
            } else {
                this.startTime = moment(this.Data.booking.sessionStartTime).format('MMM. D, YYYY | h:mmA');
            }
            this.endTime = moment(this.Data.booking.sessionEndTime).format('h:mmA ');
            if (moment(this.Data.booking.startTime).month() == 4) {
                this.originalStartTime = moment(this.Data.booking.startTime).format('MMM D, YYYY | h:mmA');
            } else {
                this.originalStartTime = moment(this.Data.booking.startTime).format('MMM. D, YYYY | h:mmA');
            }
            this.originalEndTime = moment(this.Data.booking.endTime).format('h:mmA ');
            this.sessionlength = this.Data.booking.payments.actualSessionTime;
            this.totalAmount = this.Data.booking.payments.actualAmount;
            if (this.sessionlength > 1) {
                this.hours = 'hours';
            } else {
                this.hours = 'hour';
            }
        }
        this.notificationStore = this.store.select('notification').subscribe((res: any) => {
            if (res.notificationByIdSuccess && res.notificationByIdSuccess != undefined && res.notificationByIdSuccess.data && res.notificationByIdSuccess.data != undefined && res.notificationByIdSuccess.data.booking && res.notificationByIdSuccess.data.booking != undefined) {
                this.notificationType = res.notificationByIdSuccess.data.booking.status;
                this.ratedTutor = res.notificationByIdSuccess.data.booking.isRated;
            }
        });
    }

    ngOnInit() {
    }

    checkRating() {
        this.showError2 = false;
    }

    raiseDispute(bookingID) {
        let id = bookingID;
        this.dialogRef.close();
        this.dialogRef.afterClosed().subscribe((result: string) => {
            this.dialogRef = null;
            this.openRaiseDispute(id);
        });
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    openRaiseDispute(bookingID) {
        let dialogRef = this.dialog.open(RaiseDisputeDialog, {
            data: bookingID
        });
    }

    rateTutor() {
        this.showError = false;

        if (this.currentRate > 0) {
            if (this.message != '' && this.message != undefined) {
                this.rateTutorData = {
                    bookingId: (this.Data && this.Data.booking) ? this.Data.booking._id : 0,
                    rating: this.currentRate,
                    feedback: this.message ? this.message : null
                };
            } else {
                this.rateTutorData = {
                    bookingId: (this.Data && this.Data.booking) ? this.Data.booking._id : 0,
                    rating: this.currentRate
                };
            }
        } else if (this.currentRate === 0 && this.message != '' && this.message != undefined) {
            this.showError = true;
            return;
        } else {
            this.rateTutorData = {
                bookingId: (this.Data && this.Data.booking) ? this.Data.booking._id : 0
            };
        }

        this.store.dispatch({
            type: sessionsDetails.actionTypes.RATE_TUTOR,
            payload: {apiData: this.rateTutorData, data: this.Data.student}
        });
    }

    onlyRateTutor() {

        if (this.currentRate === 0 && (this.message == '' || this.message == undefined)) {
            this.showError2 = true;
            return;
        }
        if (this.currentRate > 0) {
            if (this.message != '' && this.message != undefined) {
                this.rateTutorData = {
                    bookingId: (this.Data && this.Data.booking) ? this.Data.booking._id : 0,
                    rating: this.currentRate,
                    feedback: this.message ? this.message : null
                };
            } else {
                this.rateTutorData = {
                    bookingId: (this.Data && this.Data.booking) ? this.Data.booking._id : 0,
                    rating: this.currentRate
                };
            }
        } else if (this.currentRate === 0 && this.message != '' && this.message != undefined) {
            this.showError2 = true;
            return;
        }
        this.store.dispatch({
            type: sessionsDetails.actionTypes.ONLY_RATE_TUTOR,
            payload: this.rateTutorData
        });
    }

    openApprove2Modal(data) {
    }

}

