import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'common-error-dialog',
    templateUrl: './no-hour-available.html',
    styleUrls: ['./no-hour-available.scss']
})

export class NoHourAvailable implements OnInit {

    isCanada = false;

    constructor(public dialogRef: MatDialogRef<NoHourAvailable>,
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
