import { Component, Renderer, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';
import 'style-loader!./cancel-session-policies-dialog.scss';
import * as sessionsDetails from './../../state/all-sessions.actions';
import { Subscription } from 'rxjs/Rx';
import * as moment from 'moment';

@Component({
    selector: 'cancel-session-policies-dialog',
    templateUrl: `./cancel-session-policies-dialog.html`
})
export class CancelSessionPoliciesDialog {

    no_showReason: any;
    sendval: any;
    showError: boolean;
    public form: FormGroup;
    public selectedReason: boolean = false;
    public cancelPolicy: AbstractControl;
    public cancelAdditionText: AbstractControl;
    public policyStore: Subscription;
    public sessionStore: Subscription;
    public policies = [];
    public bookingDetails: any = {};
    public label: any;
    public parentNoShow: boolean = false;
    public bookingId: any;
    dataType: any;

    public showTextArea: boolean = false;
    bookingId1: any;
    public reason: string = 'Select Reason';
    public cancelData;
    sessionStarted = false;

    constructor(
        public dialogRef: MatDialogRef<CancelSessionPoliciesDialog>, @Inject(MAT_DIALOG_DATA) public childData: any,
        private dialog: MatDialog, private renderer: Renderer, private store: Store<any>,
        private fb: FormBuilder, private router: Router, private sessionService: AllSessionService) {
        this.dataType = childData;
        if (childData && childData.data == 'declineReason') {
            this.dataType = childData.data;
            this.bookingId1 = childData.bookingId;

        }
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.cancelData = {};
        this.store.dispatch({
            type: sessionsDetails.actionTypes.GET_CANCELLATION_POLICIES
        });
        if (this.sessionService.bookingId && this.sessionService.bookingId != undefined) {
            this.bookingId = this.sessionService.bookingId;
            this.getBookingData();
        } else {
            if (localStorage.getItem('bookingId')) {
                this.bookingId = localStorage.getItem('bookingId');
                this.getBookingData();
            } else {
                this.bookingId = '';
            }
        }
        this.policyStore = this.store.select('sessionsDetails').subscribe((res: any) => {
            if (res) {

                if (res.policies && res.policies != undefined && res.policies.parentCancellationReasons && res.policies.parentCancellationReasons != undefined) {
                    if (this.dataType == 'declineReason') {
                        this.policies = res.policies.parentDeclineReasons;
                    } else {
                        this.policies = res.policies.parentCancellationReasons;
                    }
                }
            }
        });
        this.form = fb.group({
            'cancelPolicy': [''],
            'cancelAdditionText': ['']
        });
        this.cancelPolicy = this.form.controls['cancelPolicy'];
        this.cancelAdditionText = this.form.controls['cancelAdditionText'];
        this.sessionDataSubscribe();
    }

    sessionDataSubscribe() {
        this.sessionStore = this.store.select('sessionsDetails').subscribe((res: any) => {
            if (res.bookingById && res.bookingById != undefined) {
                this.bookingDetails = res.bookingById;
                if (moment().isAfter(this.bookingDetails.startTime)) {
                    this.sessionStarted = true;
                }
            }
        });
    }

    ngOnInit() {
    }

    getBookingData() {
        this.store.dispatch({
            type: sessionsDetails.actionTypes.GET_BOOKING_BY_ID,
            payload: this.bookingId
        });
    }

    changeSelection() {
    }

    closeDialog() {
        this.dialogRef.close();
    }

    cancelBooking() {
        this.dialogRef.close();
    }

    sendReason(ev, policy) {
        // this.selectedReason = false;
        if (policy.label != undefined) {
            this.no_showReason = policy.label;

        }
        if (policy != undefined && policy.text != undefined) {
            this.label = policy.text;
        } else {
            this.label = policy;
        }
        if (policy.text) {
            this.reason = policy.text;
        } else {
            this.reason = policy;
        }
        if (this.label == 'other') {
            this.showTextArea = true;
        } else {
            this.showTextArea = false;
        }
        this.cancelPolicy.setValue(this.label);
    }

    change() {
        this.selectedReason = !this.selectedReason;
    }

    changeReason(event) {
        // this.selectedReason= !this.selectedReason
        // this.label = policy.label;
        // if (event.value == "other") {
        //     this.showTextArea = true;
        // }
        // else {
        //     this.showTextArea = false;
        // }
    }

    cancel(value) {
        if (this.label === undefined) {
            this.showError = true;
            return;
        } else {
            this.showError = false;
        }

        if (this.no_showReason === 'NO_SHOW') {
            this.parentNoShow = true;
        } else {
            this.parentNoShow = false;
        }

        this.cancelAdditionText.setValue(value);

        this.cancelData = {
            reason: this.label,
            bookingId: this.bookingId,
            tutorNoShow: this.parentNoShow
        };

        if (value != '') {
            this.cancelData.additionalDetails = value;
        }
        this.store.dispatch({
            type: sessionsDetails.actionTypes.CANCEL_BOOKING_BY_ID,
            payload: this.cancelData
        });
    }

    cancelDecline() {
        this.dialogRef.close();
    }

    declineSession() {
        if (this.label === undefined) {
            this.showError = true;
            return;
        } else {
            this.showError = false;
        }
        let fd = new FormData();
        fd.append('reason', this.label);
        fd.append('action', 'REJECT');
        this.cancelData = {
            FormData: fd,
            bookingId: this.bookingId1
        };
        this.store.dispatch({
            type: sessionsDetails.actionTypes.CANCEL_TUTOR_BOOKING,
            payload: this.cancelData
        });
    }

    ngOnDestroy() {
        if (this.policyStore && this.policyStore != undefined) {
            this.policyStore.unsubscribe();
        }
    }
}
