import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { PaymentService } from '../../../services/payments/payments.service';
import { CommonErrorDialog } from '../../../auth/model/common-error-dialog/common-error-dialog';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'multi-session-card-change',
    templateUrl: 'multi-session-card-change.component.html',
    styleUrls: ['./multi-session-card-change.component.scss']

})

export class MultiSessionCardChangeComponent {

    savedCardData: any;

    constructor(public dialogRef: MatDialogRef<MultiSessionCardChangeComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, public paymentService: PaymentService,
                private fb: FormBuilder, private store: Store<any>, public router: Router,
                private dialog: MatDialog) {
    }

    closeDialog() {
        this.dialogRef.close();
    }

    openMsg() {
        this.dialogRef.close();
        let dialogRef = this.dialog.open(CommonErrorDialog, {
            data: {message: this.data.message}
        });
        this.router.navigate(['/pages/all-sessions/sessions']);
    }

    ngOnInit() {
        this.savedCardData = JSON.parse(localStorage.getItem('savedCardData'));
    }

    finalSubmit() {
        this.dialogRef.close();
        let fd = new FormData();
        fd.append('cardId', this.savedCardData._id);
        this.paymentService.changeCardForUpcoming(fd, this.data.data.booking_Id).subscribe(res => {
            this.router.navigate(['/pages/all-sessions/session-details']);
            let dialogRef = this.dialog.open(CommonErrorDialog, {
                data: {message: res.message}
            });
        }, () => {
        });
    }

}
