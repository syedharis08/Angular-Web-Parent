import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'accept-booking-hours-available',
    templateUrl: 'accept-booking-hours-available.component.html',
    styleUrls: ['./accept-booking-hours-available.component.scss']

})

export class AcceptBookingHoursAvailableComponent {

    constructor(public dialogRef: MatDialogRef<AcceptBookingHoursAvailableComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public router: Router, private dialog: MatDialog) {
    }

    ngOnInit() {
    }

    noClick() {
        this.dialogRef.close('no');
    }

    yesClick() {
        this.dialogRef.close('yes');
    }

}
