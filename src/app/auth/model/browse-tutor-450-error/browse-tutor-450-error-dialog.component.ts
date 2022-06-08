import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import 'style-loader!./browse-tutor-450-error-dialog.scss';
import { CommonService } from '../../../services/common.service';
import { CONSTANT } from '../../../shared/constant/constant';

@Component({
    selector: 'browse-tutor-450-error-dialog',
    templateUrl: './browse-tutor-450-error-dialog.html'
})

export class BrowseTuttorError450 {

    constructor(public dialogRef: MatDialogRef<BrowseTuttorError450>, @Inject(MAT_DIALOG_DATA) public data: any, private store: Store<any>,
                private toastrService: ToastrService, private dialog: MatDialog, public commonService: CommonService,
    ) {

    }

    closeDialog() {
        this.dialog.closeAll();
    }

    ngOnInit() {

    }

    goToSignUp() {
        if (process.env.ENV == 'development') {
            window.location.href = CONSTANT.signInPanelUrlInDev;
        }
        if (process.env.ENV == 'test') {
            window.location.href = CONSTANT.signInPanelUrlInTest;
        }
        if (process.env.ENV == 'production') {
            window.location.href = CONSTANT.signInPanelUrlInQual;
        }
        if (process.env.ENV == 'demo') {
            window.location.href = CONSTANT.signInPanelUrlInDemo;
        }
        if (process.env.ENV == 'live') {
            window.location.href = CONSTANT.signInPanelUrlInLive;
        }
    }

}
