import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'style-loader!./no-invoice-dialog.component.scss';

@Component({
    selector: 'no-invoice-dialog',
    templateUrl: './no-invoice-dialog.component.html'
})

export class NoInvoiceDialogComponent {

    constructor(public dialogRef: MatDialogRef<NoInvoiceDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
                private dialog: MatDialog) {

    }

    closeDialog() {
        this.dialog.closeAll();
        this.dialogRef.afterClosed().subscribe(() => {
            let el = $('#moveUp');
            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                el.focus();
            });
        });
    }

    ngOnInit() {

    }

}
