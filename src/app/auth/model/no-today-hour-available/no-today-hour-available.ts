import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'common-error-dialog',
    templateUrl: './no-today-hour-available.html',
    styleUrls: ['./no-today-hour-available.scss']
})

export class NoTodayHourAvailable implements OnInit {

    constructor(public dialogRef: MatDialogRef<NoTodayHourAvailable>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private dialog: MatDialog, public commonService: CommonService
    ) {
    }

    ngOnInit(): void {
        console.log(this.data.userData,'    isCanada = false;\n    isCanada = false;\n');
    }

    closeDialog() {
        this.data = '';
        this.dialog.closeAll();
    }

}
