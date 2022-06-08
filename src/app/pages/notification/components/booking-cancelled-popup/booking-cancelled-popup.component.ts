import { Component, Renderer, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaThemeSpinner } from '../../../../theme/services';
import 'style-loader!./booking-cancelled-popup.scss';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ContactTutorDialog } from '../../../all-sessions/components/contact-tutor/contact-tutordialog.component';

@Component({
    selector: 'booking-cancelled-popup',
    templateUrl: './booking-cancelled-popup.html',
})

export class BookingCancelled {
    public startTime: string;
    public endTime: string;
    public notificationData: any;

    constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private baThemeSpinner: BaThemeSpinner,
                private toastrService: ToastrService, private renderer: Renderer, private dialog: MatDialog,
    ) {
        if (data && data != undefined) {
            this.notificationData = data;
            if (moment(this.notificationData.booking.startTime).month() == 4) {
                this.startTime = moment(this.notificationData.booking.startTime).format('MMM D, YYYY | h:mmA');
            } else {
                this.startTime = moment(this.notificationData.booking.startTime).format('MMM. D, YYYY | h:mmA');
            }
            this.endTime = moment(this.notificationData.booking.endTime).format('h:mmA ');
        }
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    onSubmit(value) {
    }

    contactTutor(data) {
        this.dialog.closeAll();
        let ref = this.dialog.open(ContactTutorDialog, {
            data: data
        });

    }
}
