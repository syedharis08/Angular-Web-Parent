import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'style-loader!./browse-tutor-451-error-dialog.scss';
import { CommonService } from "../../../services/common.service";

@Component({
    selector: 'browse-tutor-451-error-dialog',
    templateUrl: './browse-tutor-451-error-dialog.html'
})

export class BrowseTuttorError451 {
    constructor(
        public dialogRef: MatDialogRef<BrowseTuttorError451>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog,public commonService: CommonService,
            ) {

    }
    closeDialog() {
        this.dialog.closeAll();
        this.dialogRef.afterClosed().subscribe(() => {
            let el = $('#moveUp');
            $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
                el.focus();
            });
        });
    }
    ngOnInit() {
    }

}
