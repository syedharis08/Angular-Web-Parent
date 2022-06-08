import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as profile from '../../state/profile.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'accept-booking-hours-available',
    templateUrl: 'out-of-hour-confirm.component.html',
    styleUrls: ['./out-of-hour-confirm.component.scss']

})

export class OutOfHourConfirmComponent {

    constructor(public dialogRef: MatDialogRef<OutOfHourConfirmComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private store: Store<any>,
                public router: Router, private dialog: MatDialog) {
    }

    ngOnInit() {
    }

    noClick() {
        this.dialogRef.close('no');
    }

    yesClick() {
        let fd = new FormData();
        fd.append('isParentOutOfTutoringHours', true);
        this.store.dispatch({
            type: profile.actionTypes.UPDATE_PARENT_PROFILE,
            payload: {
                updates: fd
            }
        });
        this.dialogRef.close('yes');
    }

}
