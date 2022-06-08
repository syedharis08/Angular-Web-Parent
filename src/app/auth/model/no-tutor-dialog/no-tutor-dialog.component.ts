import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'style-loader!./no-tutor-dialog.scss';
import { CommonService } from "../../../services/common.service";

@Component({
    selector: 'no-tutor-dialog',
    templateUrl: './no-tutor-dialog.html'
})


export class NoTutorDialog {


    constructor(
        public dialogRef: MatDialogRef<NoTutorDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
      public commonService: CommonService,
        private dialog: MatDialog) {

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
