import { BookSessionService } from './../../../../services/session-service/session.service';
import { Component, ViewChild, ViewChildren, QueryList, ElementRef, Renderer, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as app from '../../../../state/app.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator, NameValidator } from '../../../../theme/validators';
import { BaThemeSpinner } from '../../../../theme/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as sessionsDetails from './../../state/all-sessions.actions';
import 'style-loader!./dispute.scss';

import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'raise-dispute-dialog',
    templateUrl: `./raise-dispute.html`

})
export class RaiseDisputeDialog {
    bookingId: any;
    caseId: any;
    public policyStore: Subscription;
    disputereasons: any;
    reasonValue: any;
    message: any;
    reasonError: boolean = false;
    disputeRaised: boolean = false;
    policies;
    form: any;

    constructor(
        public dialogRef: MatDialogRef<RaiseDisputeDialog>,
        @Inject(MAT_DIALOG_DATA) public Data: any,
        private dialog: MatDialog,
        private renderer: Renderer,
        private store: Store<any>,
        private fb: FormBuilder,
        private router: Router,
        private toastservice: ToastrService,
        private booksessionservice: BookSessionService,
        private modalService: NgbModal) {
        this.form = fb.group({
            'reasonValue': ['', Validators.compose([Validators.required])],

        });
        this.reasonValue = this.form.controls['reasonValue'];
        this.store.dispatch({
            type: sessionsDetails.actionTypes.GET_CANCELLATION_POLICIES,
        });
        if (localStorage.getItem('bookingId') != undefined) {
            this.bookingId = localStorage.getItem('bookingId');
        }
        this.policyStore = this.store
            .select('sessionsDetails')
            .subscribe((res: any) => {
                if (res) {
                    if (res.policies && res.policies != undefined && res.policies.disputeReasons && res.policies.disputeReasons != undefined) {
                        this.disputereasons = res.policies.disputeReasons;
                    }
                }
            });

    }

    ngOnInit() {
    }

    closeIt() {
        this.dialog.closeAll();
        this.router.navigate(['/pages/all-sessions/sessions']);
    }

    closeDialog() {
        this.dialog.closeAll();
        if (this.bookingId != undefined) {
            this.store.dispatch({
                type: sessionsDetails.actionTypes.GET_BOOKING_BY_ID,
                payload: this.bookingId
            });
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    sendContactTutor() {
        let fd = new FormData();
        fd.append('bookingId', this.Data);
        if (!this.reasonValue.value) {
            this.reasonError = true;
            this.markFormGroupTouched(this.form);

            return;
        } else {
            fd.append('disputeReason', this.reasonValue.value);
        }
        if (this.message) {
            fd.append('additionalDetails', this.message);
        }
        this.booksessionservice.raiseDispute(fd).subscribe((result) => {
            if (result.statusCode == 200) {
                this.disputeRaised = true;
                this.caseId = result.data.disputeId;

                if (this.bookingId != undefined) {
                    this.store.dispatch({
                        type: sessionsDetails.actionTypes.GET_BOOKING_BY_ID,
                        payload: this.bookingId
                    });
                }
            }
        }, (error) => {
            this.toastservice.error(error.message);
        });
    }

}

