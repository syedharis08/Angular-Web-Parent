import { BookSessionService } from './../../../../services/session-service/session.service';
import {
    Component,
    ViewChild,
    ViewChildren,
    QueryList,
    ElementRef,
    Renderer,
    Input,
    Output,
    EventEmitter,
    Inject
} from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbModule, NgbRatingModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as app from '../../../../state/app.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator, NameValidator } from '../../../../theme/validators';
import { BaThemeSpinner } from '../../../../theme/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import * as sessionsDetails from './../../state/all-sessions.actions';
import { StarRatingModule } from 'angular-star-rating';

// import 'style-loader!./rating.scss';
import { RaiseDisputeDialog } from '../raise-dispute/raise-dispute.component';

@Component({
    selector: 'rating',
    templateUrl: 'rating.html',
    styleUrls: ['./rating.scss']

})
export class RatingDialog {
    bookingStatus: any;
    sessionlength: number;
    date: string;
    totalAmount;
    endTime: string;
    startTime: string;
    message: any;
    hours = 'hour';
    currentRate: number = 0;
    rateTutorData: any;
    showError: boolean = false;
    showError2: boolean = false;
    public ratedTutor: boolean = false;
    public tutorApproved: boolean = false;
    originalStartTime: string;
    originalEndTime: string;

    constructor(
        public dialogRef: MatDialogRef<RatingDialog>,
        @Inject(MAT_DIALOG_DATA) public Data: any,
        private dialog: MatDialog,
        private renderer: Renderer,
        private store: Store<any>,
        private fb: FormBuilder,
        private router: Router,
        private toastservice: ToastrService,
        private booksessionservice: BookSessionService
    ) {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        if (this.Data != undefined && this.Data.data) {
            this.bookingStatus = this.Data.data.status;
            this.ratedTutor = this.Data.tutorRated;
            this.tutorApproved = this.Data.tutorApproved;
            this.date = this.Data.data.sessionStartTime;
            // this.startTime = moment(this.Data.data.sessionStartTime).format("MMM. D, YYYY | h:mmA");
            if (moment(this.Data.data.sessionStartTime).month() == 4) {
                this.startTime = moment(this.Data.data.sessionStartTime).format('MMM D, YYYY | h:mmA');
            } else {
                this.startTime = moment(this.Data.data.sessionStartTime).format('MMM. D, YYYY | h:mmA');
            }

            this.endTime = moment(this.Data.data.sessionEndTime).format('h:mmA ');
            // this.originalStartTime = moment(this.Data.data.startTime).format("MMM. D, YYYY | h:mmA");
            if (moment(this.Data.data.startTime).month() == 4) {
                this.originalStartTime = moment(this.Data.data.startTime).format('MMM D, YYYY | h:mmA');
            } else {
                this.originalStartTime = moment(this.Data.data.startTime).format('MMM. D, YYYY | h:mmA');
            }
            this.originalEndTime = moment(this.Data.data.endTime).format('h:mmA ');
            this.sessionlength = this.Data.data.payments.actualSessionTime;
            if (this.sessionlength > 1) {
                this.hours = 'hours';
            } else {
                this.hours = 'hour';
            }
            this.totalAmount = this.Data.data.payments.actualAmount;
        }
    }

    ngOnInit() {
        // if(this.Data.data && this.Data.data.studentId) {
        // }
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    raiseDispute(bookingID) {
        this.dialogRef.close();
        this.dialogRef.afterClosed().subscribe((result: string) => {
            this.dialogRef = null;
            this.openDisputeDialog(bookingID);
        });

    }

    openDisputeDialog(bookingID) {
        let ref = this.dialog.open(RaiseDisputeDialog, {
            data: bookingID
        });
    }

    rateTutor() {
        if (this.currentRate > 0) {
            if (this.message != '' && this.message != undefined) {
                this.rateTutorData = {
                    bookingId: (this.Data && this.Data.data) ? this.Data.data._id : 0,
                    rating: this.currentRate,
                    feedback: this.message ? this.message : null
                };
            } else {
                this.rateTutorData = {
                    bookingId: (this.Data && this.Data.data) ? this.Data.data._id : 0,
                    rating: this.currentRate
                };
            }
        } else if (this.currentRate === 0 && this.message != '' && this.message != undefined) {
            this.showError = true;
            return;
        } else {
            this.rateTutorData = {
                bookingId: (this.Data && this.Data.data) ? this.Data.data._id : 0
            };
        }

        this.store.dispatch({
            type: sessionsDetails.actionTypes.RATE_TUTOR,
            payload: {apiData: this.rateTutorData, data: this.Data.data.studentId}
        });
    }

    checkRating() {
        this.showError2 = false;
    }

    onlyRateTutor() {

        if (this.currentRate === 0 && (this.message == '' || this.message == undefined)) {
            this.showError2 = true;
            return;
        }
        if (this.currentRate > 0) {

            if (this.message != '' && this.message != undefined) {
                this.showError2 = false;

                this.rateTutorData = {
                    bookingId: (this.Data && this.Data.data) ? this.Data.data._id : 0,
                    rating: this.currentRate,
                    feedback: this.message ? this.message : null
                };
            } else {
                this.rateTutorData = {
                    bookingId: (this.Data && this.Data.data) ? this.Data.data._id : 0,
                    rating: this.currentRate
                };
            }
        } else if (this.currentRate === 0 && this.message != '' && this.message != undefined) {
            this.showError2 = true;
            return;
        }
        let fd = new FormData();

        this.store.dispatch({
            type: sessionsDetails.actionTypes.ONLY_RATE_TUTOR,
            payload: this.rateTutorData
        });
    }

}

