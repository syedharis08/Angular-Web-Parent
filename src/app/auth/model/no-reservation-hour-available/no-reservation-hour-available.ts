import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'common-error-dialog',
    templateUrl: './no-reservation-hour-available.html',
    styleUrls: ['./no-reservation-hour-available.scss']
})

export class NoReservationHourAvailable implements OnInit {

    isCanada = false;

    constructor(public dialogRef: MatDialogRef<NoReservationHourAvailable>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private dialog: MatDialog, public commonService: CommonService
    ) {
    }

    ngOnInit(): void {
        this.isCanada = this.commonService.checkIsCanada(this.data.userData);
    }

    closeDialog() {
        this.data = '';
        this.dialog.closeAll();

    }

}
