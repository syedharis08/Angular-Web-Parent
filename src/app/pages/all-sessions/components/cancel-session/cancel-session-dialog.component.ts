import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'style-loader!./cancel-session-dialog.scss';
import { CancelSessionPoliciesDialog } from '../cancel-session-policies/cancel-session-policies-dialog.component'

@Component({
    selector: 'cancel-session-dialog',
    templateUrl: `./cancel-session-dialog.html`
})
export class CancelSessionDialog {

    constructor(
        public dialogRef: MatDialogRef<CancelSessionDialog>, @Inject(MAT_DIALOG_DATA) public childData: any, private dialog: MatDialog) {
    }

    ngOnInit() {
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    cancelBooking() {
        this.dialogRef.close();
        this.dialogRef.afterClosed().subscribe((result: string) => {
            this.dialogRef = null;
            this.openPolicyDialog();
        });
    }

    openPolicyDialog() {
        let ref = this.dialog.open(CancelSessionPoliciesDialog)
    }

}

