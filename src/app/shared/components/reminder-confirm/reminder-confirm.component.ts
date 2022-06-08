import { Component, Renderer, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import 'style-loader!./reminder-confirm.scss';
import { BookSessionService } from '../../../services/session-service/session.service';
import { RatingPopupDialog } from '../../../pages/notification/components/rating-popup/rating-popup.component';
import { BaThemeSpinner } from '../../../theme/services/baThemeSpinner';

@Component({
    selector: 'reminder-confirm',
    templateUrl: './reminder-confirm.html',
    styleUrls: ['./reminder-confirm.scss']

})
export class ReminderConfirmComponent {
    date: string;
    totalAmount;
    endTime: string;
    startTime: string;
    message: any;
    count = 0;
    showData = false;

    constructor(public dialogRef: MatDialogRef<RatingPopupDialog>, @Inject(MAT_DIALOG_DATA) public Data: any,
                private dialog: MatDialog, private renderer: Renderer, private store: Store<any>,
                private spinner: BaThemeSpinner, private toastservice: ToastrService,
                private booksessionservice: BookSessionService
    ) {
    }

    ngOnInit() {
        this.getData();
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    getData() {
        this.spinner.show();
        this.showData = false;
        this.booksessionservice.getStudentUpcoming({studentId: this.Data._id}).subscribe(res => {
            if (res.data > 0) {
                this.count = res.data;
            }
            this.spinner.hide();
            this.showData = true;
        }, () => {
            this.showData = true;
            this.spinner.hide();
        });
    }

}

